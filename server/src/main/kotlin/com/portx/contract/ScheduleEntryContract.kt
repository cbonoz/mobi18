package com.portx.contract

import com.portx.state.ScheduleEntryState
import net.corda.core.contracts.CommandData
import net.corda.core.contracts.Contract
import net.corda.core.contracts.requireSingleCommand
import net.corda.core.contracts.requireThat
import net.corda.core.transactions.LedgerTransaction

/**
 * A implementation of a basic smart contract in Corda.
 *
 * This contract enforces rules regarding the creation of a valid [ScheduleEntryState], which in turn encapsulates an [ScheduleEntry].
 *
 * For a new [ScheduleEntry] to be issued onto the ledger, a transaction is required which takes:
 * - Zero input states.
 * - One output state: the new [ScheduleEntry].
 * - An Create() command with the public keys of both the lender and the borrower.
 *
 * All contracts must sub-class the [Contract] interface.
 */
class ScheduleEntryContract : Contract {
    companion object {
        @JvmStatic
        val SCHEDULE_CONTRACT_ID = "com.portx.contract.ScheduleEntryContract"
        @JvmStatic
        val PORT_NOT_PRESENT_ERROR = "The schedule entry's port id must be present."
        @JvmStatic
        val START_TIME_POSITIVE_ERROR = "The schedule entry's start time must be greater than 0."
        @JvmStatic
        val START_TIME_GREATER_ERROR = "The schedule entry's end time must be greater than the start time."
        @JvmStatic
        val OWNER_NOT_PRESENT_ERROR = "The schedule entry's owner must be present."
    }

    /**
     * The verify() function of all the states' contracts must not throw an exception for a transaction to be
     * considered valid.
     */
    override fun verify(tx: LedgerTransaction) {
        val command = tx.commands.requireSingleCommand<Commands.Create>()
        requireThat {
            // Generic constraints around the ScheduleEntry transaction.
            "No inputs should be consumed when issuing an ScheduleEntry." using (tx.inputs.isEmpty())
            "Only one output state should be created." using (tx.outputs.size == 1)
            val out = tx.outputsOfType<ScheduleEntryState>().single()
            "All of the participants must be signers." using (command.signers.containsAll(out.participants.map { it.owningKey }))

            // entry-specific constraints.
            PORT_NOT_PRESENT_ERROR using out.portId.isNotBlank()
            START_TIME_POSITIVE_ERROR using (out.startTime >= 0)
            START_TIME_GREATER_ERROR using (out.endTime > out.startTime)
            OWNER_NOT_PRESENT_ERROR using out.owner.isNotBlank()
        }
    }

    /**
     * This contract only implements one command, Create.
     */
    interface Commands : CommandData {
        class Create : Commands
    }
}
