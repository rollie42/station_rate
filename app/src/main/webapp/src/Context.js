import React, { useState } from 'react'
import { histogramSize } from 'utils'
import stationJson from './stationData'

const GameStateContext = React.createContext({})
const StationDataContext = React.createContext(stationJson)
const FilterContext = React.createContext({})
const FilteredStationDataContext = React.createContext(stationJson)

stationJson.sort((a,b) => b.restaurantScore - a.restaurantScore)

function ContextWrapper({children}) {
    const [gameState, setGameState] = useState({})
    const [stationData, setStationData] = useState(stationJson)
    const [filters, setFilters] = useState({
        restaurantScore: [0, histogramSize-1],
        priceScore: [0, histogramSize-1],
        isNearShinkansen: "",
        isNearCostco: "",
    })
    const [filteredStationData, setFilteredStationData] = useState(stationJson)
    
    return (
        <GameStateContext.Provider value={[gameState, setGameState]}>
            <StationDataContext.Provider value={[stationData, setStationData]}>
                <FilterContext.Provider value={[filters, setFilters]}>
                    <FilteredStationDataContext.Provider value={[filteredStationData, setFilteredStationData]}>
                        {children}
                    </FilteredStationDataContext.Provider>
                </FilterContext.Provider>
            </StationDataContext.Provider>
        </GameStateContext.Provider>
    )
}

export { GameStateContext, StationDataContext, FilterContext, FilteredStationDataContext, ContextWrapper }