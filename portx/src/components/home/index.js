import React, { Fragment } from 'react'

import Map from '../map/'
import Search from '../search/'
import Jumbo from '../jumbo/'
import Nav from '../nav/'

import { searchPorts } from '../../helper/api'

export default class Home extends React.Component {

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
    return <Fragment>
      <Nav/>
      <Jumbo/>
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

    </Fragment>
  }
}