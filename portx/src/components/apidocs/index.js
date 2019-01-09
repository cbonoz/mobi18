import React, { Component } from 'react';

class ApiDocs extends Component {
    render() {
        return (
            <iFrame src="docs.html" style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                border: 'none'
            }} />
        );
    }
}

export default ApiDocs;