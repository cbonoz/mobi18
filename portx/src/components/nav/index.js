import React from "react";
import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from "react-bootstrap";
import "./style.css";

import logo from "./../../assets/portx_header.png";

export default () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">
          {/* <i class="fas fa-home"></i> */}
          <img src={logo} />
          {/* <span>PortX</span> */}
        </a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav pullRight>
      <NavItem eventKey={1} href="/schedule">
        Schedule A Pickup
      </NavItem>
      <NavItem eventKey={2} href="/api">
        API
      </NavItem>
      <NavItem eventKey={3} href="/about">
        About
      </NavItem>
    </Nav>
  </Navbar>
);
