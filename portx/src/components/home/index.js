import React, { Fragment } from 'react'

import MainApp from '../main'
import Jumbo from '../jumbo/'
import { searchPorts } from '../../helper/api'
import Nav from '../nav';

export default class Home extends React.Component {
  
  render() {
    return <MainApp/>
  }
}