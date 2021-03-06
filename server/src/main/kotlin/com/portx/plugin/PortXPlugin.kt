package com.portx.plugin

import com.portx.api.PortXApi
import net.corda.webserver.services.WebServerPluginRegistry
import java.util.function.Function

class PortXPlugin : WebServerPluginRegistry {
    /**
     * A list of classes that expose web APIs.
     */
    override val webApis = listOf(Function(::PortXApi))

    /**
     * A list of directories in the resources directory that will be served by Jetty under /web.
     */
    override val staticServeDirs = mapOf(
            // This will serve the exampleWeb directory in resources to /web/portx
            "portx" to javaClass.classLoader.getResource("exampleWeb").toExternalForm()
    )
}
