import React, { Component, Fragment } from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'

import Popup from '../popup/'

const myIcon = window.L.icon({
  iconUrl: 'port_icon.png',
  iconSize: [40],
  iconAnchor: [18, 40],
  popupAnchor: [2, -40]
})

window.myIcon = myIcon

export default class MyMarkers extends Component {

  state = {
    ports: []
  }

  markerReferences = {}

  componentDidUpdate(prevProps, prevState) {

    // if ((this.props.focusedPort && !prevProps.focusedPort) ||
    //   this.props.focusedPort && this.props.focusedPort.id !== prevProps.focusedPort.id) {
    //     if (prevProps.focusedPort && this.markerReferences[prevProps.focusedPort.id]) {
    //       this.markerReferences[prevProps.focusedPort.id].contextValue.popupContainer.closePopup()
    //     }

    //     if (this.markerReferences[this.props.focusedPort.id]) {
    //       setTimeout(() => {
    //       this.markerReferences[this.props.focusedPort.id].contextValue.popupContainer.openPopup()
    //       }, 500)
    //     }
    // }
    //console.log(this.markeReferences)
  }

  filterOutBadData = payload => payload.data.filter(port => port.lat && port.lng)

  render() {
    const { ports } = this.props

    return <Fragment>
      {ports.map(port => (
        <Marker
          icon={myIcon} 
          key={port.id} 
          position={[ port.latitude, port.longitude ]}
        >
            <Popup
              // ref={elem => this.markerReferences[port.id] = elem}
              focusPort={this.props.focusPort}
              hello="hi"
              port={port} /> 
        </Marker>
        )
      )}
      </Fragment>
  }
  
}
