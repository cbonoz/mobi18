const library = (function () {
    const axios = require('axios');

    const BASE_URL = `localhost:8001`

    function getPorts() {
        return axios.get(`${BASE_URL}/ports`)
    }

    function getPortInfo(portId)  {
        return axios.get(`${BASE_URL}/ports/${portId}`)
    }

    return {
        getPorts,
        getPortInfo
    }

})();
module.exports = library;

