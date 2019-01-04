package com.portx.contract

import com.portx.contract.ScheduleEntryContract.Companion.OWNER_NOT_PRESENT_ERROR
import com.portx.contract.ScheduleEntryContract.Companion.PORT_NOT_PRESENT_ERROR
import com.portx.contract.ScheduleEntryContract.Companion.SCHEDULE_CONTRACT_ID
import com.portx.contract.ScheduleEntryContract.Companion.START_TIME_GREATER_ERROR
import com.portx.contract.ScheduleEntryContract.Companion.START_TIME_POSITIVE_ERROR
import com.portx.state.ScheduleEntryState
import net.corda.core.identity.CordaX500Name
import net.corda.testing.core.TestIdentity
import net.corda.testing.node.MockServices
import net.corda.testing.node.ledger
import org.junit.Test

class ScheduleEntryContractTest {
    private val ledgerServices = MockServices()
    private val megaCorp = TestIdentity(CordaX500Name("MegaCorp", "London", "GB"))
    private val miniCorp = TestIdentity(CordaX500Name("MiniCorp", "New York", "US"))
    private val scheduleEntryState = ScheduleEntryState("portId", "owner", miniCorp.party, 100, 1000)

    @Test
    fun `transaction must include Create command`() {
        ledgerServices.ledger {
            transaction {
                output(SCHEDULE_CONTRACT_ID, scheduleEntryState)
                fails()
                command(listOf(miniCorp.publicKey), ScheduleEntryContract.Commands.Create())
                verifies()
            }
        }
    }

    @Test
    fun `transaction must have no inputs`() {
        ledgerServices.ledger {
            transaction {
                input(SCHEDULE_CONTRACT_ID, scheduleEntryState)
                output(SCHEDULE_CONTRACT_ID, scheduleEntryState)
                command(listOf(miniCorp.publicKey, miniCorp.publicKey), ScheduleEntryContract.Commands.Create())
                `fails with`("No inputs should be consumed when issuing an ScheduleEntry.")
            }
        }
    }

    @Test
    fun `transaction must have one output`() {
        ledgerServices.ledger {
            transaction {
                output(SCHEDULE_CONTRACT_ID, scheduleEntryState)
                output(SCHEDULE_CONTRACT_ID, scheduleEntryState)
                command(listOf(miniCorp.publicKey, miniCorp.publicKey), ScheduleEntryContract.Commands.Create())
                `fails with`("Only one output state should be created.")
            }
        }
    }

    @Test
    fun `expected party must sign transaction`() {
        ledgerServices.ledger {
            transaction {
                output(SCHEDULE_CONTRACT_ID, scheduleEntryState)
                command(listOf(megaCorp.publicKey), ScheduleEntryContract.Commands.Create()) // incorrect signer
                `fails with`("All of the participants must be signers.")
            }
        }
    }

    @Test
    fun `must create startTime not equal to endTime ScheduleEntry`() {
        ledgerServices.ledger {
            transaction {
                val badState = scheduleEntryState.copy(startTime = 1000, endTime = 1000)
                output(SCHEDULE_CONTRACT_ID, badState)
                command(listOf(miniCorp.publicKey), ScheduleEntryContract.Commands.Create())
                `fails with`(START_TIME_GREATER_ERROR)
            }
        }
    }

    @Test
    fun `must create startTime greater than endTime ScheduleEntry`() {
        ledgerServices.ledger {
            transaction {
                val badState = scheduleEntryState.copy(startTime = 1000, endTime = 100)
                output(SCHEDULE_CONTRACT_ID, badState)
                command(listOf(miniCorp.publicKey), ScheduleEntryContract.Commands.Create())
                `fails with`(START_TIME_GREATER_ERROR)
            }
        }
    }


    @Test
    fun `cannot create negative-value startTime ScheduleEntrys`() {
        ledgerServices.ledger {
            transaction {
                val badState = scheduleEntryState.copy(startTime = -1)
                output(SCHEDULE_CONTRACT_ID, badState)
                command(listOf(miniCorp.publicKey), ScheduleEntryContract.Commands.Create())
                `fails with`(START_TIME_POSITIVE_ERROR)
            }
        }
    }

    @Test
    fun `cannot create negative-value endTime ScheduleEntrys`() {
        ledgerServices.ledger {
            transaction {
                val badState = scheduleEntryState.copy(portId = "")
                output(SCHEDULE_CONTRACT_ID, badState)
                command(listOf(miniCorp.publicKey), ScheduleEntryContract.Commands.Create())
                `fails with`(PORT_NOT_PRESENT_ERROR)
            }
        }
    }

    @Test
    fun `cannot create ownerless ScheduleEntrys`() {
        ledgerServices.ledger {
            transaction {
                val badState = scheduleEntryState.copy(owner = "")
                output(SCHEDULE_CONTRACT_ID, badState)
                command(listOf(miniCorp.publicKey), ScheduleEntryContract.Commands.Create())
                `fails with`(OWNER_NOT_PRESENT_ERROR)
            }
        }
    }
}