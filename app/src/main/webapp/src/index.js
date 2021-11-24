import 'normalize.css'
import './App.css'
import React from 'react'
import ReactDOM from 'react-dom'
import MapView from 'Map/MapView'
import FilterBar from 'Filters/FilterBar'
import styled from 'styled-components'
import Context from 'Context'
import ResultsPanel from 'Map/ResultsPanel'


const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

function App() {
  return (
    <Container className="App">
      <FilterBar />
      <ResultsPanel />
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
