import React from 'react'

import Search from '../search'
import Map from '../map'
import ScheduleView from '../ScheduleView'
import BookingView from '../BookingView'
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';

import './style.css'

import { searchPorts } from '../../helper/api'

export default class MainApp extends React.Component {

  state = {
    bookingTimePort: null,
    viewSchedulePort: null,
    ports: []
  }

  performSearch = (searchTerm) => {
    searchPorts(searchTerm)
      .then(result => {
        const ports = result.data
        this.setState({ ports, focusedPort: ports[0] })
      })
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

  shouldShowBackButton() {
    const { bookingTimePort,  viewSchedulePort} = this.state
    return (bookingTimePort || viewSchedulePort)
  }

  render() {
    return <React.Fragment>

      <div id="app-panel" className={this.getClassForPanel()}> 
        { this.shouldShowBackButton() && (
          <div id="back-button">
            <Fab onClick={this.backToSearch} variant="extended" aria-label="Back to Search">
              <Icon className="fa fa-caret-left"  />
                  Back To Search
            </Fab>
          </div>
        )}
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