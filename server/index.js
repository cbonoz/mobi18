'use strict'

const lotion = require('lotion')
const Hapi = require('hapi')
const fs = require('fs')
const csvToJson = require('convert-csv-to-json')

const PORT_FILE = './data/ports.csv'

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8001
})

// Add the route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, h) {
        return 'hello world'
    }
})

server.route({
    method: 'GET',
    path: '/ports',
    handler: function (request, h) {

        // Features of interest
        // id = port id, name = port name, lat, lng
        return csvToJson.getJsonFromCsv(PORT_FILE).map(port => {
            return {
                id: port.FID,
                name: port.portname,
                lat: port.latitude,
                lng: port.longtitude
            }
        })
    },
    options: {
        cache: {
            expiresIn: 24 * 60 * 60 * 1000, // cache for 24 hours.
            privacy: 'private'
        }
    }
})

server.route({
    method: 'GET',
    path: '/ports/{portId}',
    handler: function (request, h) {
        const portId = request.params.portId

        // TODO: return scheduling data about port (from lotion state)
        return csvToJson.getJsonFromCsv(PORT_FILE)
    }
})

server.route({
    method: 'POST',
    path: '/schedule',
    handler: function (request, h) {

        // TODO: process scheduling request for a given port id (returning conflicts if any).
        // If scheduling request
        return {}
    }
})

/*
 * state will assume the following structure and will be synchronized across the nodes in the network (powered by lotion/terndermint)
 * state = {
 *     portId: {
 *         date1: {
 *         }
 *     },
 *    ...
 * }
 */

const app = lotion({
    initialState: {} // no initial state (initially no scheduling information)
})

app.use(function (state, tx) {
    // State evolution handler
    // if (state.count === tx.nonce) {
    //     state.count++
    // }
})

// Start the hapi server
const start = async function () {

    // Start the tendermint server followed by the API.
    try {
        app.start()
        await server.start()
    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }

    console.log('Server running at:', server.info.uri)
}

start()
