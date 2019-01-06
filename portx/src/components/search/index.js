import React from 'react'
import './style.css'

export default class Search extends React.Component {

  state = {
    searchTerm: ''
  }

  onSearchChange = event => {
    event.preventDefault()
    this.props.searchFn(event.target.value)
    return false
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
      <div id="searchbar"> 
        <form id="inputForm" autoComplete="off" onSubmit={this.onSearchChange}>
          <input id="searchInput" type="text" placeholder="Search Ports"/>
        </form>
        {this.renderSearchResultList()}
      </div>
    )
  }
}