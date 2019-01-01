package com.portx.schema

data class PortSearchPayload(val query: String?, val numResults: Int=5)