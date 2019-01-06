import React from 'react'
import { Popup } from 'react-leaflet'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import './style.css'

export default class MyPopup extends React.Component {
  
  onOpen = () => {
    console.log(this)
    this.props.focusPort(this.props.port)
  }
  
  render() {
    const { port } = this.props
  
    return (
      <Popup onOpen={this.onOpen} className="port-popup">
        <h2 className="header">{port.portname}</h2>
        <div className="button-section">
          <Button 
            onClick={() => this.props.bookTime(port)} 
            className="popup-button" 
            variant="text">
            Schedule a Pickup
          </Button>
          <br/>
          <Button 
            onClick={() => this.props.viewScheduleOfPort(port)}
            className="popup-button" 
            variant="text">
            View Schedule
          </Button>
        </div>
      </Popup>
    )
  }
}