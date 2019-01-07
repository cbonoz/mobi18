
import axios from 'axios'

const PORT = 10009
const BASE_URL = `http://localhost:${PORT}/api/portx`

export function getPorts() {
    return axios.get(`${BASE_URL}/ports`)
}

export function getPortInfo(portId)  {
    return axios.get(`${BASE_URL}/ports/${portId}`)
}

export function searchPorts(query, numResults) {
    if (!numResults) {
        numResults = 8
    }

    const url = `${BASE_URL}/ports/search`
    return axios.post(url, {query, numResults} )
}

export function createScheduleEntry({ portId, start, end, owner, terminal, description }) {
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

export function findBookingsInRange({ portId, start, end }) {
    const url = `${BASE_URL}/schedule/${portId}?start=${start}&end=${end}`
    return axios.get(url)
}