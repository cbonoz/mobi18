package com.portx.schema

data class ScheduleEntryPayload(val portId: String?, val start: Long?, val end: Long?, val owner: String = "PortX")
