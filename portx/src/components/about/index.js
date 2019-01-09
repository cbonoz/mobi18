import React, { Component } from 'react'
import Jumbo from '../jumbo/'

class About extends Component {
    render() {
        return (
            <iFrame src="about.html" style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                border: 'none'
            }} />
        );
    }
}

export default About