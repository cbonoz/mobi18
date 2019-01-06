import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/home'
import About from './components/about'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

class App extends Component {

  render() {

    return <BrowserRouter>
      <div className="main-content">
        <div className="main-content-without-footer">

          <div className="row">
            <Switch>
              {/*Redirect action routes*/}
              <Route path="/" exact component={Home} />
              <Route path="/about/" component={About} />
              {/* <Route path="/users/" component={Users} /> */}
              {/* <Route component={NotFound} /> */}
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>

  }
}

export default App;
