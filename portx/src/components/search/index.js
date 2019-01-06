import React from 'react'
import './style.css'

export default class Search extends React.Component {

  state = {
    searchTerm: ''
  }

  onSearchChange = event => {
    // event.preventDefault()
    // this.props.search(event.target.value)
    return false
  }


  renderSearchResultList = () => {
    const { searchResults } = this.props

    return searchResults.map((result, index) => (
      <li key={index}>{result}</li>
    ))
  }

  render() {
    
    return (
      <div id="searchbar"> 
        <h1>Search</h1>
        <form id="inputForm" autocomplete="off" onSubmit={this.onSearchChange}>
          <input id="searchInput" type="text"/>
        </form>
      </div>
    )
  }
}