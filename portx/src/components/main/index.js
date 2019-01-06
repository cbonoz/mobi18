import React from 'react'

import Search from '../search'
import Map from '../map'

import { searchPorts } from '../../helper/api'

export default class MainApp extends React.Component {

  state = {
    ports: []
  }

  performSearch = (searchTerm) => {
    const ports = searchPorts(searchTerm)
    this.setState({ ports, focusedPort: ports[0] })
      // .then(payload => {
      //   const ports = payload.data
      //   this.setState({ ports })
      // })
  }

  focusPort = port => {
    this.setState({
      focusedPort: port
    })
  }

  render() {
    return <React.Fragment>
    <Search
        focusPort={this.focusPort} 
        focusedPort={this.state.focusedPort} 
        searchResults={this.state.ports} 
        searchFn={this.performSearch}/>

      <Map 
        ports={this.state.ports} 
        focusedPort={this.state.focusedPort} 
        focusPort={this.focusPort}
      />
    </React.Fragment>
  }
}