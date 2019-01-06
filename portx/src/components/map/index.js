import React, { Component } from 'react'
import { Map, TileLayer} from 'react-leaflet'
import Ports from '../markers/'
import './style.css'

class MyMap extends Component {
  state = {}

  startingPosition = [42.83368138733589, -112.61501312255861]
  startingZoom = 4

  handleViewPortChange = newViewPort => {
    console.log(newViewPort)
    this.setState({ ...newViewPort })
  }

  resolveViewBox = () => {
    const { focusedPort } = this.props

   if (!focusedPort) {
      return {
        position: this.startingPosition,
        zoom: this.startingZoom
      }
   }

    return {
      position: [focusedPort.latitude, focusedPort.longitude],
      zoom: 7
    }
  }

  render() {

    const viewBox = this.resolveViewBox()

    return (
      <Map
        center={viewBox.position} 
        zoom={viewBox.zoom}
        onViewportChanged={this.handleViewPortChange}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Ports 
          {...this.props}
        />
      </Map>
    );
  }
}

export default MyMap;