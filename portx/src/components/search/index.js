import React from 'react'
import './style.css'

export default class Search extends React.Component {

  state = {
    searchTerm: ''
  }

  onSearchSubmit = event => {
    event.preventDefault()
    this.props.searchFn(this.state.searchTerm)
    return true
  }

  onInputChange = event => {
    this.setState({ searchTerm: event.target.value })
  }

  searchResultClicked = port => () => this.props.focusPort(port)

  renderSearchResultList = () => {
    const { searchResults, focusedPort } = this.props

    if (!searchResults || searchResults.length === 0)
      return null

    return (
      <ul className="searchList">
        {searchResults.map((port, index) => (
          <li className={focusedPort && port.id === focusedPort.id ? 'selected' : ''} 
          onClick={this.searchResultClicked(port)} 
          key={index}>
            <img height="15px" src="port_icon.png" alt="portx icon"/> {port.portname}
          </li>
        ))}
      </ul>
    )
  }

  render() {
    
    return (
      <React.Fragment>
        <form id="inputForm" autoComplete="off" onSubmit={this.onSearchSubmit}>
          <input 
            id="searchInput" 
            name="search" 
            type="text" 
            placeholder="Search Ports"
            onChange={this.onInputChange}
          />
        </form>
        {this.renderSearchResultList()}
      </React.Fragment>
    )
  }
}