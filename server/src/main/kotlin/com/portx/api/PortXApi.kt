package com.portx.api

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.portx.flow.IOUFlow
import com.portx.flow.ScheduleEntryFlow
import com.portx.schema.*
import com.portx.state.IOUState
import com.portx.state.ScheduleEntryState
import me.xdrop.fuzzywuzzy.FuzzySearch
import net.corda.core.contracts.StateAndRef
import net.corda.core.identity.CordaX500Name
import net.corda.core.messaging.CordaRPCOps
import net.corda.core.messaging.startTrackedFlow
import net.corda.core.messaging.vaultQueryBy
import net.corda.core.node.services.IdentityService
import net.corda.core.node.services.Vault
import net.corda.core.node.services.vault.QueryCriteria
import net.corda.core.node.services.vault.builder
import net.corda.core.utilities.getOrThrow
import net.corda.core.utilities.loggerFor
import org.slf4j.Logger
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response
import javax.ws.rs.core.Response.Status.*

val SERVICE_NAMES = listOf("Notary", "Network Map Service")

// This API is accessible from /api/portx. All paths specified below are relative to it.
@Path("portx")
class PortXApi(private val rpcOps: CordaRPCOps) {
    private val myLegalName: CordaX500Name = rpcOps.nodeInfo().legalIdentities.first().name

    companion object {
        private val logger: Logger = loggerFor<PortXApi>()

    }

    /**
     * Returns the node's name.
     */
    @GET
    @Path("me")
    @Produces(MediaType.APPLICATION_JSON)
    fun whoami() = mapOf("me" to myLegalName)

    /**
     * Returns all parties registered with the [NetworkMapService]. These names can be used to look up identities
     * using the [IdentityService].
     */
    @GET
    @Path("peers")
    @Produces(MediaType.APPLICATION_JSON)
    fun getPeers(): Map<String, List<CordaX500Name>> {
        val nodeInfo = rpcOps.networkMapSnapshot()
        return mapOf("peers" to nodeInfo
                .map { it.legalIdentities.first().name }
                //filter out myself, notary and eventual network map started by driver
                .filter { it.organisation !in (SERVICE_NAMES + myLegalName.organisation) })
    }

    /*
     * CUSTOM ROUTES BELOW
     */

    /**
     * Displays all known Ports and their locations.
     */
    @GET
    @Path("ports")
    @Produces(MediaType.APPLICATION_JSON)
    fun getPorts(): Response {
        val simplePorts = getPortsFromManifest()
        return Response.status(OK).entity(simplePorts).build()
    }


    /**
     * Fuzzy search of ports
     */
    @POST
    @Path("ports/search")
    @Produces(MediaType.APPLICATION_JSON)
    fun searchPorts(payload: PortSearchPayload): Response {
        if (payload.query.isNullOrBlank()) {
            return Response.status(BAD_REQUEST).entity("query must be provided in post body").build()
        }

        val simplePorts = getPortsFromManifest()
        val extractTop = FuzzySearch.extractTop(payload.query, simplePorts.map { port -> port.name }, payload.numResults)
        val topMatches = extractTop.map { simplePorts[it.index] }
        return Response.status(OK).entity(topMatches).build()
    }

    private fun getPortsFromManifest(): List<SimplePort> {
        val ports = jacksonObjectMapper().readValue<List<Port>>(javaClass.classLoader.getResource("ports.json"))
        val simplePorts = ports.map { SimplePort(it.FID, it.portname, it.latitude, it.longitude) }
        return simplePorts
    }

    /**
     * Displays all the Port Schedules that exist in the node's vault.
     * Either search by portId, or by portId in a given time interval.
     */
    @GET
    @Path("schedule/{portId}")
    @Produces(MediaType.APPLICATION_JSON)
    fun getSchedules(@PathParam("portId") portId: String, @QueryParam("start") start: Long?, @QueryParam("end") end: Long?): Response {
        try {
            validatePortId(portId)
        } catch (ex: Throwable) {
            logger.error(ex.message, ex)
            return Response.status(BAD_REQUEST).entity(ex.message!!).build()
        }

        if (start == null || end == null) {
            return Response.status(OK).entity(getScheduleEntries(portId)).build()
        }
        return Response.status(OK).entity(getScheduleEntriesInRange(portId, start, end)).build()
    }

    private fun validatePortId(portId: String?) {
        if (portId.isNullOrBlank()) {
            throw Exception("portId must be provided")
        }
        // Verify the provided port id is valid and exists.
        val portExists = getPortsFromManifest().any { port -> port.id == portId }
        if (!portExists) {
            throw Exception("portId ${portId} does not map to a known port")
        }
    }

    private fun getScheduleEntries(portId: String): List<StateAndRef<ScheduleEntryState>> {
        val generalCriteria = QueryCriteria.VaultQueryCriteria(Vault.StateStatus.ALL)
        builder {
            val portIdType = ScheduleEntrySchemaV1.PersistentScheduleEntry::portId.equal(portId)
            val customCriteria = QueryCriteria.VaultCustomQueryCriteria(portIdType)
            val criteria = generalCriteria.and(customCriteria)
            return rpcOps.vaultQueryBy<ScheduleEntryState>(criteria).states
        }
    }

    /**
     * Initiates a flow to create a new Schedule Entry
     *
     * Once the flow finishes it will have written the IOU to ledger. Both the lender and the borrower will be able to
     * see it when calling /api/portx/ious on their respective nodes.
     *
     * This end-point takes a Party name parameter as part of the path. If the serving node can't find the other party
     * in its network map cache, it will return an HTTP bad request.
     *
     * The flow is invoked asynchronously. It returns a future when the flow's call() method returns.
     */
    @POST
    @Path("schedule")
    fun createScheduleEntry(payload: ScheduleEntryPayload): Response {
        val portId = payload.portId
        val start = payload.start
        val end = payload.end

        try {
            validatePortId(portId)
        } catch (ex: Throwable) {
            logger.error(ex.message, ex)
            return Response.status(BAD_REQUEST).entity(ex.message!!).build()
        }

        if (start == null || end == null) {
            return Response.status(BAD_REQUEST).entity("start and end timestamp values must be defined as query parameters.\n").build()
        }

        return try {
            // Verify there isn't another entry for this port in the same time slot.
            verifyScheduleSlotAvailable(portId!!, start, end)
            val signedTx = rpcOps.startTrackedFlow(ScheduleEntryFlow::Initiator, portId, start, end).returnValue.getOrThrow()
            Response.status(CREATED).entity("schedule entry transaction id ${signedTx.id} committed to ledger.\n").build()

        } catch (ex: Throwable) {
            logger.error(ex.message, ex)
            Response.status(BAD_REQUEST).entity("error creating schedule entry: ${ex.message!!}").build()
        }
    }

    private fun verifyScheduleSlotAvailable(portId: String, start: Long, end: Long) {
        val violatingSchedules = getScheduleEntriesInRange(portId, start, end)

        if (violatingSchedules.isNotEmpty()) {
            throw Exception("could not insert schedule item, violation by: " + violatingSchedules.joinToString(", "))
        }
    }

    private fun getScheduleEntriesInRange(portId: String, start: Long, end: Long): List<StateAndRef<ScheduleEntryState>> {
        val generalCriteria = QueryCriteria.VaultQueryCriteria(Vault.StateStatus.ALL)
        return builder {
            val portIdType = ScheduleEntrySchemaV1.PersistentScheduleEntry::portId.equal(portId)
            val endStartCondition = ScheduleEntrySchemaV1.PersistentScheduleEntry::endTime.greaterThan(start)
            val endEndCondition = ScheduleEntrySchemaV1.PersistentScheduleEntry::endTime.lessThan(end)
            val startStartCondition = ScheduleEntrySchemaV1.PersistentScheduleEntry::startTime.greaterThan(start)
            val startEndCondition = ScheduleEntrySchemaV1.PersistentScheduleEntry::startTime.lessThan(end)
            // Verify that the portId matches and one of the start or end times falls within the query range.
            val criteria = generalCriteria
                    .and(QueryCriteria.VaultCustomQueryCriteria(portIdType))
                    .and(QueryCriteria.VaultCustomQueryCriteria(endStartCondition)
                            .or(QueryCriteria.VaultCustomQueryCriteria(endEndCondition))
                            .or(QueryCriteria.VaultCustomQueryCriteria(startStartCondition))
                            .or(QueryCriteria.VaultCustomQueryCriteria(startEndCondition))
                    )
            rpcOps.vaultQueryBy<ScheduleEntryState>(criteria).states
        }
    }

    /**
     * Initiates a flow to agree an IOU between two parties.
     *
     * Once the flow finishes it will have written the IOU to ledger. Both the lender and the borrower will be able to
     * see it when calling /api/portx/ious on their respective nodes.
     *
     * This end-point takes a Party name parameter as part of the path. If the serving node can't find the other party
     * in its network map cache, it will return an HTTP bad request.
     *
     * The flow is invoked asynchronously. It returns a future when the flow's call() method returns.
     */
    @PUT
    @Path("create-iou")
    fun createIOU(@QueryParam("iouValue") iouValue: Int, @QueryParam("partyName") partyName: CordaX500Name?): Response {
        if (iouValue <= 0) {
            return Response.status(BAD_REQUEST).entity("query parameter 'iouValue' must be non-negative.\n").build()
        }
        if (partyName == null) {
            return Response.status(BAD_REQUEST).entity("query parameter 'partyName' missing or has wrong format.\n").build()
        }
        val otherParty = rpcOps.wellKnownPartyFromX500Name(partyName)
                ?: return Response.status(BAD_REQUEST).entity("party named $partyName cannot be found.\n").build()

        return try {
            val signedTx = rpcOps.startTrackedFlow(IOUFlow::Initiator, iouValue, otherParty).returnValue.getOrThrow()
            Response.status(CREATED).entity("IOU transaction id ${signedTx.id} committed to ledger.\n").build()

        } catch (ex: Throwable) {
            logger.error(ex.message, ex)
            Response.status(BAD_REQUEST).entity(ex.message!!).build()
        }
    }

    /**
     * Displays all IOU states that are created by Party.
     */
    @GET
    @Path("my-ious")
    @Produces(MediaType.APPLICATION_JSON)
    fun myious(): Response {
        val generalCriteria = QueryCriteria.VaultQueryCriteria(Vault.StateStatus.ALL)
        val results = builder {
            var partyType = IOUSchemaV1.PersistentIOU::lenderName.equal(rpcOps.nodeInfo().legalIdentities.first().name.toString())
            val customCriteria = QueryCriteria.VaultCustomQueryCriteria(partyType)
            val criteria = generalCriteria.and(customCriteria)
            val results = rpcOps.vaultQueryBy<IOUState>(criteria).states
            return Response.ok(results).build()
        }
    }
}