import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import * as Context from 'Context'
import styled from 'styled-components'
import { histogram } from 'utils'
import ShinkansenImg from 'images/shinkansen.png'
import CostcoImg from 'images/costco.png'
import DataGrid from 'react-data-grid'

const RecordContainer = styled.div`
    border: 1px solid black;
    min-height: 40px;
    max-height: 50px;
`

const Icon = styled.img`
    min-width: 20px;
    min-height: 20px;
    max-width: 20px;
    max-height: 20px;
`

function Record({data}) {
    const engName = data.names.find(r => r.type === "English").name
    const jpnName = data.names.find(r => r.type === "Kanji").name
    return(
        <tr>
            <td>{engName}</td>
            <td>{jpnName}</td>
            <td>{data.restaurantScore.toFixed(2)}</td>
            <td>{data.priceScore.toFixed(2)}</td>
            <td>
                {data.isNearCostco && <Icon src={CostcoImg} />}
                {data.isNearShinkansen && <Icon src={ShinkansenImg} />}
            </td>
        </tr>
    )
}

const Container = styled.div`
    flex-direction: column;
    display: block;
    padding-left: 80px;
    padding-top: 25px;

`

const filterStationData = (stationData, filters) => {
    const priceHist = histogram(stationData.map(d => d['priceScore']))
    const restaurantHist = histogram(stationData.map(d => d['restaurantScore']))
    console.log(filters)
    const meetsStaticFilters = (record) => {        
        return !['isNearCostco','isNearShinkansen'].some(sel => filters[sel] !== "" && (record[sel] ? 'yes' : 'no') !== filters[sel])
    }
    return stationData.filter(d => {
        return meetsStaticFilters(d) &&
            d.priceScore >= priceHist[filters.priceScore[0]].start &&
            d.priceScore <= priceHist[filters.priceScore[1]-1].end && // TODO: why is -1 needed here?
            d.restaurantScore >= restaurantHist[filters.restaurantScore[0]].start &&
            d.restaurantScore <= restaurantHist[filters.restaurantScore[1]-1].end
    })
}

const Table = styled.table`
`

export default function ListView() {
    const [filters, setFilters] = useContext(Context.FilterContext)
    const [stationData] = useContext(Context.StationDataContext)

    const filteredData = filterStationData(stationData, filters)
    filteredData.sort((a,b) => b.restaurantScore - a.restaurantScore)

    return (
        <Container>
            <Table>
                <thead>
                    <tr>
                        <th>English name</th>
                        <th>Japanese name</th>
                        <th>Restaurant score</th>
                        <th>Price score</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(d => <Record data={d} />)}
                </tbody>
            </Table>
        </Container>
    )
}