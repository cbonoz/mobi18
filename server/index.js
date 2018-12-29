'use strict'

const lotion = require('lotion')
const Hapi = require('hapi')

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

const app = lotion({
    initialState: {
        count: 0
    }
})

app.use(function (state, tx) {
    // State evolution handler
    if (state.count === tx.nonce) {
        state.count++
    }
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
