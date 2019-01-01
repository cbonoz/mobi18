package com.portx.state

import com.portx.schema.ScheduleEntrySchemaV1
import net.corda.core.contracts.ContractState
import net.corda.core.contracts.LinearState
import net.corda.core.contracts.UniqueIdentifier
import net.corda.core.identity.AbstractParty
import net.corda.core.identity.Party
import net.corda.core.schemas.MappedSchema
import net.corda.core.schemas.PersistentState
import net.corda.core.schemas.QueryableState

/**
 * The state object representing a reservation of a particular time slot at a particular port id.
 *
 * A state must implement [ContractState] or one of its descendants.
 *
 * @param portId the id of the desired port.
 * @param owner the party owning the schedule entry slot.
 * @param startTime the startTime (epoch ms) of the port reservation
 * @param endtime the endTime (epoch ms) of the port reservation
 */
data class ScheduleEntryState(val portId: String,
                              val owner: Party,
                              val startTime: Long,
                              val endTime: Long,
                              override val linearId: UniqueIdentifier = UniqueIdentifier()):
        LinearState, QueryableState {
    /** The public keys of the involved parties. */
    override val participants: List<AbstractParty> get() = listOf(owner)

    override fun generateMappedObject(schema: MappedSchema): PersistentState {
        return when (schema) {
            is ScheduleEntrySchemaV1 -> ScheduleEntrySchemaV1.PersistentScheduleEntry(
                    this.portId,
                    this.owner.name.toString(),
                    this.startTime,
                    this.endTime,
                    this.linearId.id
            )
            else -> throw IllegalArgumentException("Unrecognised schema $schema")
        }
    }

    override fun supportedSchemas(): Iterable<MappedSchema> = listOf(ScheduleEntrySchemaV1)
}
