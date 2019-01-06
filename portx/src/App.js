import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/home'
import Nav from './components/nav'
import About from './components/about'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ApiDocs from './components/apidocs';

class App extends Component {

  render() {

    return <BrowserRouter>
      <div className="main-content">
        {/* <div className="main-content-without-footer"> */}
          <Nav />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/about" component={About} />
              <Route path="/api" component={ApiDocs} />

              {/* TODO: replace About with Schedule component */}
              <Route path="/schedule" component={About} />
              {/* <Route component={NotFound} /> */}
            </Switch>
        </div>
    </BrowserRouter>

  }
}

export default App;
