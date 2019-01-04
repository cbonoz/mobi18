package com.portx.schema

import net.corda.core.schemas.MappedSchema
import net.corda.core.schemas.PersistentState
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table

/**
 * The family of schemas for Schedule Entries.
 */
object ScheduleEntrySchema

/**
 * An Schedule Entry schema.
 */
object ScheduleEntrySchemaV1 : MappedSchema(
        schemaFamily = ScheduleEntrySchema.javaClass,
        version = 1,
        mappedTypes = listOf(PersistentScheduleEntry::class.java)) {
    @Entity
    @Table(name = "iou_states")
    class PersistentScheduleEntry(
            @Column(name = "port_id")
            var portId: String,

            @Column(name = "owner")
            var owner: String,

            @Column(name = "signer")
            var signer: String,

            @Column(name = "start")
            var startTime: Long,

            @Column(name = "end")
            var endTime: Long,

            @Column(name = "linear_id")
            var linearId: UUID
    ) : PersistentState() {
        // Default constructor required by hibernate.
        constructor(): this("", "", "", 0, 0, UUID.randomUUID())
    }
}