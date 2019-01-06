package com.portx.schema

import net.corda.core.serialization.CordaSerializable

@CordaSerializable
data class ScheduleEntryPayload(
        val portId: String,
        val start: Long,
        val end: Long,
        val terminal: String,
        val description: String = "",
        val owner: String = "PortX"
)
