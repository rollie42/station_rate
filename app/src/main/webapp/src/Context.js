import React, { useState } from 'react'
import stationJson from './stationData'

const GameStateContext = React.createContext({})
const StationDataContext = React.createContext(stationJson)

export default function Context({children}) {
    const [gameState, setGameState] = useState({})
    const [stationData, setStationData] = useState(stationJson)
    
    return (
        <GameStateContext.Provider value={[gameState, setGameState]}>
            <StationDataContext.Provider value = {[stationData, setStationData]}>
                {children}
            </StationDataContext.Provider>
        </GameStateContext.Provider>
    )
}

export { GameStateContext }