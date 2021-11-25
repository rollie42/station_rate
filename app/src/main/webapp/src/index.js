import 'normalize.css'
import './App.css'
import React from 'react'
import ReactDOM from 'react-dom'
import MapView from 'Map/MapView'
import FilterBar from 'Filters/FilterBar'
import styled from 'styled-components'
import Context from 'Context'
import ResultsPanel from 'Map/ResultsPanel'
import { Status, Wrapper } from '@googlemaps/react-wrapper'


const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

const render = (status) => {
  return <h1>{status}</h1>;
};

function App() {
  return (
    <Container className="App" render={render}>
      {/* <Wrapper apiKey={'AIzaSyCpumSwwtnzCJRahDjwCnVObKfJLNR60zY'}> */}
        <FilterBar />
        <ResultsPanel />
      {/* </Wrapper> */}
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
