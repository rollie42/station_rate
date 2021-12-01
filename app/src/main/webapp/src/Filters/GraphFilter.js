import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import { Div, Context } from 'Shared'
import styled from 'styled-components'
import Graph from './Graph'
import Slider, {Range} from 'rc-slider'
import 'rc-slider/assets/index.css'
import { histogram } from 'utils'
import {Title} from './FilterBar'
import HelpIcon from './HelpIcon'
 
const Container = styled(Div)`
    flex-direction: column;
    max-height: 200px;
    border: 1px solid black;
    padding: 5px;
    position: relative;
`

const StyledSlider = styled(Range)`
    width: 98%;
`

export default function GraphFilter({title, selector, helpText}) {
    const [filters, setFilters] = useContext(Context.FilterContext)
    const [stationData] = useContext(Context.StationDataContext)
    const records = stationData.map(d => d[selector])
    const buckets = histogram(records)
    const max = buckets.length - 1

    buckets.forEach((b, idx) => {
        if (idx < filters[selector][0] || idx > filters[selector][1]) {
            b.disabled = true
        }
    })

    const filterChange = (range) => {
        setFilters(f => {
            const updated = {...f}
            updated[selector] = range 
            return updated
        })
    }
    return (
        <Container>
            <Title>{title}</Title>
            <Graph buckets={buckets} />
            <StyledSlider min={0} max={max} defaultValue={[0, max]} onChange={filterChange}/>            
            <HelpIcon helpText={helpText} />
        </Container>
    )
}