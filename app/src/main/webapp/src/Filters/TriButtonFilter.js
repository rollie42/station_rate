import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import * as Context from 'Context'
import styled from 'styled-components'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import { Title } from './FilterBar'

const Container = styled.div`
    flex-direction: column;
    min-height: 100px;
    max-height: 100px;
`

export default function TriButtonFilter({title, selector}) {
    const [filters, setFilters] = useContext(Context.FilterContext)
    const [stationData] = useContext(Context.StationDataContext)

    const filterChange = (evt, val) => {
        setFilters(f => {
            const updated = {...f}
            updated[selector] = val
            return updated
        })
    }

    return (
        <Container>
            <Title>{title}</Title>
            <ToggleButtonGroup onChange={filterChange} value={filters[selector]} exclusive>
                <ToggleButton value="yes">Yes</ToggleButton>
                <ToggleButton value="no">No</ToggleButton>
                <ToggleButton value="">Don't care</ToggleButton>
            </ToggleButtonGroup>
        </Container>
    )
}