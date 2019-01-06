import React from 'react'
import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import './style.css'

export default () => (
  <Navbar>
  <Navbar.Header>
    <Navbar.Brand>
      <a href="#home">
        <i class="fas fa-home"></i>
        <span>PortX</span>
      </a>
    </Navbar.Brand>
  </Navbar.Header>
  <Nav pullRight>
    <NavItem eventKey={1} href="#">
      Schedule A Pickup
    </NavItem>
    <NavItem eventKey={2} href="#">
      View Schedules
    </NavItem>
    <NavItem eventKey={3} href="#">
      About
    </NavItem>
  </Nav>
</Navbar>
)