import React from 'react'
import { InlineTimePicker, InlineDatePicker } from 'material-ui-pickers';
import { findBookingsInRange } from '../../helper/api'

import './style.css'
export default class ScheduleView extends React.Component {

  state = {
    selectedDate: new Date(),
    bookings: []
  }

  convertToUnix = date => ~~(date.getTime() / 1000)

  resolveDates = () => {
    const start = new Date(this.state.selectedDate)

    start.setHours(0)
    start.setMinutes(0)
    start.setSeconds(0)
    start.setMilliseconds(0)

    const end = new Date(start)
    end.setDate( end.getDate() + 1)

    return { start: this.convertToUnix(start), end: this.convertToUnix(end) }
  }

  loadBookingData = () => {
    const times = this.resolveDates()

    findBookingsInRange({ portId: this.props.port.id, ...times })
      .then(result => {
        this.setState({
          bookings: result.data.map(data => data.state.data)
        })
      }).catch(error => {
        console.log('could not look up the port times', error)
      })
  }

  componentDidMount() {
    this.loadBookingData()
  }

  handleDateChange = selectedDate => this.setState({ selectedDate }, this.loadBookingData)

  renderScheduledPickups = () => {
    return this.state.bookings.map((booking, index) => (
      <li key={index}>
        <i className="fas fa-truck-moving"></i>
        <span>Owner: {booking.owner}</span>
        <span>Terminal: {booking.terminal}</span>
        <span>Description: {booking.description}</span>
      </li>
    ))
  }

  render() {

    const { port } = this.props

    return (
      <div id="schedule-view">
        <h1>View bookings at {port.name}</h1>
        <InlineDatePicker
          className="schedule-view-input"
          value={this.state.selectedDate}
          onChange={this.handleDateChange}
        />
        { this.state.bookings.length === 0 
          ? <h3>There are no bookings...</h3>
          : <ul className="schedule-view-list">
              {this.renderScheduledPickups()}
            </ul>
        }
      </div>
  )}
}