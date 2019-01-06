import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import MyMap from './components/map/'
import Jumbo from './components/jumbo'
import Nav from './components/nav/'
import Search from './components/search/'
import { searchPorts } from './helper/api'
import { Row, Col, Grid } from 'react-bootstrap'

class App extends Component {

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

    return (
      <Fragment>
        {/* <Nav/> */}
        <Jumbo/>
        <Search 
          focusPort={this.focusPort} 
          focusedPort={this.state.focusedPort} 
          searchResults={this.state.ports} 
          searchFn={this.performSearch}/>

        <MyMap 
          ports={this.state.ports} 
          focusedPort={this.state.focusedPort} 
          focusPort={this.focusPort}
        />

      </Fragment>
    );
  }
}

export default App;
