import React from "react";
import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from "react-bootstrap";
import { Link } from 'react-router-dom'
import "./style.css";

import logo from "./../../assets/portx_header.png";

export default () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">
          <img src={logo} />
        </Link>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav pullRight>
      <NavItem eventKey={2}>
        <Link to="/docs">
          API
        </Link>
      </NavItem>
      <NavItem eventKey={3}>
        <Link to="/about">
          About
        </Link>
      </NavItem>
    </Nav>
  </Navbar>
);
