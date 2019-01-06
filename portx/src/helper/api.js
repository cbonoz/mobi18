const library = (function () {
    const axios = require('axios');

    const PORT = 10009
    const BASE_URL = `http://localhost:${PORT}/api/portx/`

    function getPorts() {
        return axios.get(`${BASE_URL}/ports`)
    }

    function getPortInfo(portId)  {
        return axios.get(`${BASE_URL}/ports/${portId}`)
    }

    function searchPorts(query, numResults) {
        if (!numResults) {
            numResults = 5
        }
        const url = `${BASE_URL}/search`
        return axios.post(url, {query, numResults} )
    }

    function createScheduleEntry(portId, start, end, owner, terminal, description) {
        if (!owner) {
            owner = 'PortX'
        }

        if (!description) {
            description = ''
        }

        if (!terminal) {
            terminal = ''
        }

        const payload = {
            portId,
            start,
            end,
            owner,
            terminal,
            description
        }

        const url = `${BASE_URL}/schedule`
        return axios.post(url, payload)
    }

    return {
        getPorts,
        getPortInfo
    }

})();
module.exports = library;

