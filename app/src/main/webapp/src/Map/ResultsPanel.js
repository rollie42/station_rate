import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import * as Context from 'Context'
import styled from 'styled-components'
import ListView from './ListView'
import WrappedMapView from './MapView'
import { histogram } from 'utils'

const Container = styled.div`

`

function FilteredResultsCalc() {
    const [filters, setFilters] = useContext(Context.FilterContext)
    const [stationData] = useContext(Context.StationDataContext)
    const [filteredStationData, setFilteredStationData] = useContext(Context.FilteredStationDataContext)

    useEffect(() => {
        const priceHist = histogram(stationData.map(d => d['priceScore']))
        const restaurantHist = histogram(stationData.map(d => d['restaurantScore']))
        const meetsStaticFilters = (record) => {        
            return !['isNearCostco','isNearShinkansen'].some(sel => filters[sel] !== "" && (record[sel] ? 'yes' : 'no') !== filters[sel])
        }
        const filtered = stationData.filter(d => {
            return meetsStaticFilters(d) &&
                d.priceScore >= priceHist[filters.priceScore[0]].start &&
                d.priceScore <= priceHist[filters.priceScore[1]-1].end && // TODO: why is -1 needed here?
                d.restaurantScore >= restaurantHist[filters.restaurantScore[0]].start &&
                d.restaurantScore <= restaurantHist[filters.restaurantScore[1]-1].end
        })

        filtered.sort((a,b) => b.restaurantScore - a.restaurantScore)
        // TODO: is this really the way?
        if (filteredStationData.length !== filtered.length || filteredStationData.some((s, idx) => s.names[0].name !== filtered[idx].names[0].name)) {
            setFilteredStationData(filtered)
        }
    }, [filteredStationData, filters, setFilteredStationData, stationData])
    
    

    return(<></>)
}
export default function ResultsPanel() {
    return (
        <Container>
            <FilteredResultsCalc />
            <WrappedMapView />
        </Container>
    )
}