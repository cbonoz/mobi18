package com.portx.client

import com.portx.state.ScheduleEntryState
import net.corda.client.rpc.CordaRPCClient
import net.corda.core.contracts.StateAndRef
import net.corda.core.utilities.NetworkHostAndPort
import net.corda.core.utilities.loggerFor
import org.slf4j.Logger

/**
 *  Demonstration of using the CordaRPCClient to connect to a Corda Node and
 *  steam some State data from the node.
 **/

fun main(args: Array<String>) {
    PortXClientRPC().main(args)
}

private class PortXClientRPC {
    companion object {
        val logger: Logger = loggerFor<PortXClientRPC>()
        private fun logState(state: StateAndRef<ScheduleEntryState>) = logger.info("{}", state.state.data)
    }

    fun main(args: Array<String>) {
        require(args.size == 1) { "Usage: PortXClientRPC <node address>" }
        val nodeAddress = NetworkHostAndPort.parse(args[0])
        val client = CordaRPCClient(nodeAddress)

        // Can be amended in the com.portx.MainKt file.
        val proxy = client.start("user1", "test").proxy

        // Grab all existing and future Schedule Entry states in the vault.
        val (snapshot, updates) = proxy.vaultTrack(ScheduleEntryState::class.java)

        // Log the 'placed' Schedule Entry states and listen for new ones.
        snapshot.states.forEach { logState(it) }
        updates.toBlocking().subscribe { update ->
            update.produced.forEach { logState(it) }
        }
    }
}
