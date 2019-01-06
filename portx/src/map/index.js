import React, { Component } from 'react'
import { Map, TileLayer} from 'react-leaflet'
import AllPorts from './AllPorts'
import './style.css'

class MyMap extends Component {
  state = {}

  startingPosition = [41.26051725203973, -95.56107066191515]
  startingZoom = 4

  handleViewPortChange = newViewPort => {
    console.log(newViewPort)
    this.setState({ ...newViewPort })
  }

  render() {
    return (
      <Map
        center={this.startingPosition} 
        zoom={this.startingZoom}
        onViewportChanged={this.handleViewPortChange}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AllPorts ports={this.props.ports}/>
      </Map>
    );
  }
}

export default MyMap;