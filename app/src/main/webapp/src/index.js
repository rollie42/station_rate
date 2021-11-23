import 'normalize.css'
import './App.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Map from 'Map/Map'
import FilterBar from 'Filters/FilterBar'
import styled from 'styled-components'
import Context from 'Context'


const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

function App() {
  return (
    <Container className="App">
      <FilterBar />
      <Map />
    </Container>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <App />
    </Context>
  </React.StrictMode>,
  document.getElementById('root')
);
