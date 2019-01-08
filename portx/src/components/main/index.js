import React from 'react'

import Search from '../search'
import Map from '../map'
import ScheduleView from '../ScheduleView'
import BookingView from '../BookingView'
import SnackBar from '../snackbar'
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns';

import './style.css'
import { searchPorts, createScheduleEntry } from '../../helper/api'

const MyTheme = createMuiTheme({
  typography: {
    fontSize: '12px'
  }
})


export default class MainApp extends React.Component {

  state = {
    bookingTimePort: null,
    viewSchedulePort: null,
    ports: [],
    snackbarOpen: false
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

  submitBooking = bookingData => {
    createScheduleEntry(bookingData)
      .then(result => {
        if (result.status === 201) {
          this.setState({ 
            snackMessage: 'Successfully scheduled time', 
            snackType: 'success',
            snackbarOpen: true,
            bookingTimePort: null
          })
        }
      }).catch(error => {
        this.setState({ 
          snackMessage: 'Time already taken!', 
          snackType: 'error',
          snackbarOpen: true
        })
      })
  }

  closeSnackBar = () => this.setState({ snackbarOpen: false })

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
        submitBooking={this.submitBooking}
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
    return <MuiThemeProvider theme={MyTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>

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

      <SnackBar
        open={this.state.snackbarOpen}
        close={this.closeSnackBar}
        message={this.state.snackMessage}
        type={this.state.snackType}
      />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  }
}