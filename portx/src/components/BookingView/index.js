import React from 'react'
import { InlineTimePicker, InlineDatePicker } from 'material-ui-pickers';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

import './style.css'

export default class BookingView extends React.Component {

  state = {
    selectedDate: this.createNewDate(),
    selectedLengthOfTime: 30,
    terminalId: '',
    ownerId: '',
    description: ''
  };

  createNewDate() {
    const rightNowWithoutDetails = new Date()
    rightNowWithoutDetails.setSeconds(0)
    rightNowWithoutDetails.setMilliseconds(0)

    return rightNowWithoutDetails
  }

  handleDateChange = date => {
    this.setState({ selectedDate: date });
  };

  handleTimeChange = event => {
    this.setState({ selectedLengthOfTime: event.target.value })
  }

  handleTextChange = fieldName => event => this.setState({ [fieldName ]: event.target.value })

  isSubmitDisabled = () => {
    return this.state.terminalId.length === 0
      || this.state.ownerId.length === 0
      || this.state.description.length === 0
  }

  submit = () => {

    const convertToSeconds = timeMS => ~~(timeMS / 1000)
    const findEndTime = startTime => {
      const endTimeDate = new Date(startTime)
      endTimeDate.setMinutes( endTimeDate.getMinutes() + this.state.selectedLengthOfTime )

      return endTimeDate.getTime()
    }

    const startTime = this.state.selectedDate.getTime()
    const endTime = findEndTime(startTime)

    console.log(startTime, endTime)

    this.props.submitBooking({
      portId: this.props.port.id,
      start: convertToSeconds(startTime),
      end: convertToSeconds(endTime),
      terminal: this.state.terminalId,
      owner: this.state.ownerId,
      description: this.state.description
    })
  }

  render() {
    const { selectedDate } = this.state
    const { port } = this.props
    
    return <div id="booking-view">
      
      <h1>Schedule a booking at {port.name}</h1>

      

        <div id="booking-content">
          <InlineDatePicker
            className="booking-content-input"
            value={selectedDate}
            onChange={this.handleDateChange}
          />
          <br/>
          <InlineTimePicker
            className="booking-content-input"
            value={selectedDate}
            onChange={this.handleDateChange}
          />
          <br/>
          <Select
            id=""
            className="booking-content-input"
            value={this.state.selectedLengthOfTime}
            onChange={this.handleTimeChange}
            inputProps={{
              name: 'time',
              id: 'time',
            }}
          >
            <MenuItem value={30}>30 Minutes</MenuItem>
            <MenuItem value={60}>1 Hour</MenuItem>
            <MenuItem value={90}>1 Hour, 30 Minutes</MenuItem>
            <MenuItem value={120}>2 Hours</MenuItem>
          </Select>
          <br/>
          <TextField
            onChange={this.handleTextChange('terminalId')}
            placeholder="Terminal ID"
            className="terminal-input booking-content-input"
            margin="normal"
          />
          <br/>
          <TextField
            onChange={this.handleTextChange('ownerId')}
            placeholder="Owner ID"
            className="subscriber-input booking-content-input"
            margin="normal"
          />
          <br/>
          <TextField
            onChange={this.handleTextChange('description')}
            placeholder="Description"
            className="description-input booking-content-input"
            margin="normal"
          />
          <br/>
          <Button 
            disabled={this.isSubmitDisabled()} 
            fullWidth 
            variant="contained" 
            color="primary" 
            className="submit-input booking-content-input"
            onClick={this.submit}
            >
            Submit Booking
          </Button>
          
        </div>
    </div>
  }
}