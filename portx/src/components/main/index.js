import React from 'react'

import Search from '../search'
import Map from '../map'
import ScheduleView from '../ScheduleView'
import BookingView from '../BookingView'

import './style.css'

import { searchPorts } from '../../helper/api'

export default class MainApp extends React.Component {

  state = {
    bookingTimePort: null,
    viewSchedulePort: null,
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

  bookTimeForPort = port => {
    this.setState({
      bookingTimePort: port,
      viewSchedulePort: null
    })
    console.log('booking')
  }

  viewScheduleOfPort = port => {
    this.setState({
      bookingTimePort: null,
      viewSchedulePort: port
    })
    console.log('we are going to secheudle for this port', port)
  }

  focusPort = port => {
    this.setState({
      focusedPort: port
    })
  }

  backToSearch = () => {
    this.setState({
      bookingTimePort: null,
      viewSchedulePort: null
    })
  }

  renderCorrectDisplay() {
    const { bookingTimePort,  viewSchedulePort} = this.state

    if (bookingTimePort) {
      return <BookingView
        port={this.state.focusedPort}
        backToSearch={this.backToSearch}
      />
    }

    if (viewSchedulePort) {
      return <ScheduleView
        port={this.state.focusedPort}
        backToSearch={this.backToSearch}
      />
    }

    return <Search
      focusPort={this.focusPort} 
      focusedPort={this.state.focusedPort}
      searchResults={this.state.ports}
      searchFn={this.performSearch}/>
  }

  getClassForPanel() {
    const { bookingTimePort,  viewSchedulePort} = this.state
    if (bookingTimePort || viewSchedulePort) {
      return 'full-overlay'
    }

    return ''
  }

  render() {
    return <React.Fragment>

      <div id="app-panel" className={this.getClassForPanel()}> 
        {this.renderCorrectDisplay()}
      </div>

      <Map 
        ports={this.state.ports} 
        focusedPort={this.state.focusedPort} 
        focusPort={this.focusPort}
        bookTime={this.bookTimeForPort}
        viewScheduleOfPort={this.viewScheduleOfPort}
      />
    </React.Fragment>
  }
}