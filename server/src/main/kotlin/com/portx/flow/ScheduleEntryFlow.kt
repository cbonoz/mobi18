package com.portx.flow

import co.paralleluniverse.fibers.Suspendable
import com.portx.contract.ScheduleEntryContract
import com.portx.contract.ScheduleEntryContract.Companion.SCHEDULE_CONTRACT_ID
import com.portx.flow.ScheduleEntryFlow.Acceptor
import com.portx.flow.ScheduleEntryFlow.Initiator
import com.portx.state.ScheduleEntryState
import net.corda.core.contracts.Command
import net.corda.core.contracts.requireThat
import net.corda.core.flows.*
import net.corda.core.transactions.SignedTransaction
import net.corda.core.transactions.TransactionBuilder
import net.corda.core.utilities.ProgressTracker
import net.corda.core.utilities.ProgressTracker.Step

/**
 * This flow allows two parties (the [Initiator] and the [Acceptor]) to come to an agreement about the ScheduleEntry encapsulated
 * within an [ScheduleEntryState].
 *
 * In our simple portx, the [Acceptor] always accepts a valid ScheduleEntry.
 *
 * These flows have deliberately been implemented by using only the call() method for ease of understanding. In
 * practice we would recommend splitting up the various stages of the flow into sub-routines.
 *
 * All methods called within the [FlowLogic] sub-class need to be annotated with the @Suspendable annotation.
 */
object ScheduleEntryFlow {

    @InitiatingFlow
    @StartableByRPC
    class Initiator(val portId: String, val owner: String, val start: Long, val end: Long) : FlowLogic<SignedTransaction>() {
        /**
         * The progress tracker checkpoints each stage of the flow and outputs the specified messages when each
         * checkpoint is reached in the code. See the 'progressTracker.currentStep' expressions within the call() function.
         */
        companion object {
            object GENERATING_TRANSACTION : Step("Generating transaction based on new port Schedule Entry.")
            object VERIFYING_TRANSACTION : Step("Verifying contract constraints.")
            object SIGNING_TRANSACTION : Step("Signing transaction with our private key.")
//            object GATHERING_SIGS : Step("Gathering the counterparty's signature.") {
//                override fun childProgressTracker() = CollectSignaturesFlow.tracker()
//            }

            object FINALISING_TRANSACTION : Step("Obtaining notary signature and recording transaction.") {
                override fun childProgressTracker() = FinalityFlow.tracker()
            }

            fun tracker() = ProgressTracker(
                    GENERATING_TRANSACTION,
                    VERIFYING_TRANSACTION,
                    SIGNING_TRANSACTION,
                    FINALISING_TRANSACTION
            )
        }

        override val progressTracker = tracker()

        /**
         * The flow logic is encapsulated within the call() method.
         */
        @Suspendable
        override fun call(): SignedTransaction {
            // Obtain a reference to the notary we want to use.
            val notary = serviceHub.networkMapCache.notaryIdentities[0]

            // Stage 1.
            progressTracker.currentStep = GENERATING_TRANSACTION
            // Generate an unsigned transaction with the first legal entity as the owner.
            val scheduleEntryState = ScheduleEntryState(portId, owner, serviceHub.myInfo.legalIdentities.first(), start, end)
            val txCommand = Command(ScheduleEntryContract.Commands.Create(), scheduleEntryState.participants.map { it.owningKey })
            val txBuilder = TransactionBuilder(notary)
                    .addOutputState(scheduleEntryState, SCHEDULE_CONTRACT_ID)
                    .addCommand(txCommand)

            // Stage 2.
            progressTracker.currentStep = VERIFYING_TRANSACTION
            // Verify that the transaction is valid.
            txBuilder.verify(serviceHub)

            // Stage 3.
            progressTracker.currentStep = SIGNING_TRANSACTION
            // Sign the transaction.
            val partSignedTx = serviceHub.signInitialTransaction(txBuilder)

            // Not needed for single party tx.
//            val fullySignedTx = subFlow(CollectSignaturesFlow(partSignedTx, setOf(otherParty), GATHERING_SIGS.childProgressTracker()))

            // Stage 4
            progressTracker.currentStep = FINALISING_TRANSACTION
            // Notarise and record the transaction in the builder's vault.
            return subFlow(FinalityFlow(partSignedTx, FINALISING_TRANSACTION.childProgressTracker()))
        }
    }

    /*
     * Acceptor for other party (not applicable here, schedule entry is a single party transaction).
     */
    @InitiatedBy(Initiator::class)
    class Acceptor(val otherPartyFlow: FlowSession) : FlowLogic<SignedTransaction>() {
        @Suspendable
        override fun call(): SignedTransaction {
            val signTransactionFlow = object : SignTransactionFlow(otherPartyFlow) {
                override fun checkTransaction(stx: SignedTransaction) = requireThat {
                    val output = stx.tx.outputs.single().data
                    "This must be an Schedule Entry transaction." using (output is ScheduleEntryState)
//                    val scheduleEntryState = output as ScheduleEntryState
//                    "I won't accept IOUs with a value over 100." using (iou.value <= 100)
                }
            }

            return subFlow(signTransactionFlow)
        }
    }
}
