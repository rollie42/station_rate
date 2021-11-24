import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import * as Context from 'Context'
import styled from 'styled-components'
import { histogram } from 'utils'

const RecordContainer = styled.div`
    border: 1px solid black;
`

function Record({data}) {
    const engName = data.names.find(r => r.type === "English").name
    const jpnName = data.names.find(r => r.type === "Kanji").name
    return(
        <RecordContainer>
            {engName} ({jpnName}) - Restaurant score ({data.restaurantScore}) - Price score ({data.priceScore})
        </RecordContainer>
    )
}

const Container = styled.div`
    flex-direction: column;

`

const filterStationData = (stationData, filters) => {
    const priceHist = histogram(stationData.map(d => d['priceScore']))
    const restaurantHist = histogram(stationData.map(d => d['restaurantScore']))
    console.log(filters)
    console.log(priceHist[filters.priceScore[0]], priceHist[filters.priceScore[1]-1])
    console.log(restaurantHist[filters.restaurantScore[0]], restaurantHist[filters.restaurantScore[1]-1])
    return stationData.filter(d => {
        return d.priceScore >= priceHist[filters.priceScore[0]].start &&
            d.priceScore <= priceHist[filters.priceScore[1]-1].end &&
            d.restaurantScore >= restaurantHist[filters.restaurantScore[0]].start &&
            d.restaurantScore <= restaurantHist[filters.restaurantScore[1]-1].end
    })
}

export default function ListView() {
    const [filters, setFilters] = useContext(Context.FilterContext)
    const [stationData] = useContext(Context.StationDataContext)

    const filteredData = filterStationData(stationData, filters)
    console.log(filteredData.length)
    return (
        <Container>
            {filteredData.map(d => <Record data={d} />)}
        </Container>
    )
}