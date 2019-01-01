package com.portx.schema

data class Port(
    val FID: String,
    val annualcapacitymt: String,
    val code: String,
    val country: String,
    val createdate: String,
    val gdb_geomattr_data: String,
    val geonameid: Int,
    val humuse: String,
    val iso3: String,
    val iso3_op: String,
    val lastcheckdate: String,
    val latitude: Double,
    val locprecision: String,
    val longitude: Double,
    val maxdepth: String,
    val maxlength: String,
    val portname: String,
    val prtsize: String,
    val prttype: String,
    val remarks: String,
    val shape: String,
    val source: String,
    val status: String,
    val updatedate: String,
    val url_lca: String
)