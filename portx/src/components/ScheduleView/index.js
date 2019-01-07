import React from 'react'
import { InlineTimePicker, InlineDatePicker } from 'material-ui-pickers';


export default class ScheduleView extends React.Component {

  state = {
    selectedDate: new Date()
  }

  handleDateChange = selectedDate => this.setState({ selectedDate })

  render() {

    const { port } = this.props

    return (
      <div id="schedule-view">
        <h1>View bookings at {port.name}</h1>
        <InlineDatePicker
          className="booking-content-input"
          value={this.state.selectedDate}
          onChange={this.handleDateChange}
        />
      </div>
  )}
}