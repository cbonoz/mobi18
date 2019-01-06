import React from 'react'
import { MuiPickersUtilsProvider, InlineTimePicker, InlineDatePicker } from 'material-ui-pickers';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './style.css'

const MyTheme = createMuiTheme({
  typography: {
    fontSize: '12px'
  }
})

export default class BookingView extends React.Component {

  state = {
    selectedDate: new Date(),
    selectedLengthOfTime: 30
  };

  handleDateChange = date => {
    this.setState({ selectedDate: date });
  };

  handleTimeChange = event => {
    this.setState({ selectedLengthOfTime: event.target.value })
  }

  render() {

    const { selectedDate } = this.state
    const { port } = this.props
    
    return <div id="booking-view">
    <div id="back-button">
      <Fab onClick={this.props.backToSearch} variant="extended" aria-label="Back to Search">
        <Icon className="fa fa-caret-left"  />
             Back To Search
      </Fab>
    </div>
      
      <h1>Schedule a booking at {port.portname}</h1>

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <MuiThemeProvider theme={MyTheme}>

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
            placeholder="Terminal ID"
            className="terminal-input booking-content-input"
            margin="normal"
          />
          <br/>
          <TextField
            placeholder="Subscriber ID"
            className="subscriber-input booking-content-input"
            margin="normal"
          />
          <br/>
          <Button fullWidth variant="contained" color="primary" className="submit-input booking-content-input">
            Submit Booking
          </Button>
          
        </div>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    </div>
  }
}