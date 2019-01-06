import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import MyMap from './map'
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
    // searchPorts(searchTerm)
    //   .then(payload => {
    //     const ports = payload.data
    //     this.setState({ ports })
    //   })
  }

  render() {

    return (
      <Fragment>
        {/* <Nav/> */}
        <Jumbo/>
        <Search/>
        <MyMap ports={this.state.ports} />

      </Fragment>
    );
  }
}

export default App;
