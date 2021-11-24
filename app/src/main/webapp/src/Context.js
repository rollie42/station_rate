import React, { useState } from 'react'
import stationJson from './stationData'

const GameStateContext = React.createContext({})
const StationDataContext = React.createContext(stationJson)
const FilterContext = React.createContext({})

export default function Context({children}) {
    const [gameState, setGameState] = useState({})
    const [stationData, setStationData] = useState(stationJson)
    const [filters, setFilters] = useState({
        restaurantScore: [0, 20],
        priceScore: [0, 20],
    })
    
    return (
        <GameStateContext.Provider value={[gameState, setGameState]}>
            <StationDataContext.Provider value={[stationData, setStationData]}>
                <FilterContext.Provider value={[filters, setFilters]}>
                    {children}
                </FilterContext.Provider>
            </StationDataContext.Provider>
        </GameStateContext.Provider>
    )
}

export { GameStateContext, StationDataContext, FilterContext }