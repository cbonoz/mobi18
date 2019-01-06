import React, { Component, Fragment } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import { getPorts } from '../helper/api'

export default class AllPortMarkers extends Component {

  state = {
    ports: []
  }

  filterOutBadData = payload => payload.data.filter(port => port.lat && port.lng)

  render() {
    const { ports } = this.props

    return <Fragment>
      {ports.map(port => <Marker key={port.id} position={[ port.lat, port.lng ]}>
          <Popup>
              {port.name}
          </Popup>  
        </Marker>
      )}
      </Fragment>
  }
  
}
