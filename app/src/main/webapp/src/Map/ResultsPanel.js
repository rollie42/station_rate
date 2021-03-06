import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import { Div, Context } from 'Shared'
import styled from 'styled-components'
import ListView from './ListView'
import WrappedMapView from './MapView'
import { histogram } from 'utils'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

const Container = styled(Div)`
    position: relative;
`

function FilteredResultsCalc() {
    const [filters, setFilters] = useContext(Context.FilterContext)
    const [stationData] = useContext(Context.StationDataContext)
    const [filteredStationData, setFilteredStationData] = useContext(Context.FilteredStationDataContext)

    useEffect(() => {
        const priceHist = histogram(stationData.map(d => d['priceScore']))
        const restaurantHist = histogram(stationData.map(d => d['restaurantScore']))
        console.log(priceHist, filters)
        const meetsStaticFilters = (record) => {        
            return !['isNearCostco','isNearShinkansen'].some(sel => filters[sel] !== "" && (record[sel] ? 'yes' : 'no') !== filters[sel])
        }
        const filtered = stationData.filter(d => {
            return meetsStaticFilters(d) &&
                d.priceScore >= priceHist[filters.priceScore[0]].start &&
                d.priceScore <= priceHist[filters.priceScore[1]].end && // TODO: why is -1 needed here?
                d.restaurantScore >= restaurantHist[filters.restaurantScore[0]].start &&
                d.restaurantScore <= restaurantHist[filters.restaurantScore[1]].end
        })

        filtered.sort((a,b) => b.restaurantScore - a.restaurantScore)
        // TODO: is this really the way?
        if (filteredStationData.length !== filtered.length || filteredStationData.some((s, idx) => s.names[0].name !== filtered[idx].names[0].name)) {
            setFilteredStationData(filtered)
        }
    }, [filteredStationData, filters, setFilteredStationData, stationData])
    
    

    return(<></>)
}

const ViewToggle = styled.span`
    position: absolute;
    top: 0px;
    right: 0px;
    background: #ccccccee;
`

const HideWrapper = styled(Div)`
    display: ${props => props.hidden ? 'none' : 'inherit'}
`

export default function ResultsPanel() {
    const [view, setView] = useState('map')
    return (
        <Container>
            <FilteredResultsCalc />
            <HideWrapper hidden={view !== 'map'}><WrappedMapView  /> </HideWrapper>
            <HideWrapper hidden={view !== 'list'}><ListView  /> </HideWrapper>
            <ViewToggle>
                <ToggleButtonGroup onChange={(e,v) => setView(v)} value={view} exclusive>
                    <ToggleButton value="map">Map</ToggleButton>
                    <ToggleButton value="list">List</ToggleButton>
                </ToggleButtonGroup>
            </ViewToggle>
        </Container>
    )
}