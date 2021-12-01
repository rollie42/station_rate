import GraphFilter from './GraphFilter'
import styled from 'styled-components'
import TriButtonFilter from './TriButtonFilter'
import { Div, Context } from 'Shared'
import { Button } from '@mui/material'
import { useState } from 'react'
import HelpIcon from './HelpIcon'

const Title = styled(Div)`
`
export {Title}

const Container = styled(Div)`
    min-width: 22vw;
    max-width: 22vw;
    flex-direction: column;
    background-color: #2F4F4F;
    * {
        color: #E4FFFE;
    }

    @media only screen and (max-width: 700px) {
        position: fixed;
        min-width: 100vw;
        min-height: 100vh;
        z-index: 100;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: ${props => props.showFilter ? 'inherit' : 'none'};
    }
`

const StyledFilterButon = styled.button`
    display: none;
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 100;
    padding: 9px;

    @media only screen and (max-width: 700px) {
        display: ${props => props.showFilter ? 'none' : 'inherit'};
    }
`

function ShowFilterButton() {
    return (
        <StyledFilterButon>Options</StyledFilterButon>
    )
}

const StyledApplyButton = styled.button`
    display: none;
    background-color: #2F4F4F;
    margin-top: 20px;
    padding: 7px;
    @media only screen and (max-width: 700px) {
        display: inherit;
    }
`

function ApplyButton() {
    return (
        <StyledApplyButton>Apply</StyledApplyButton>
    )
}

export default function FilterBar() {
    // Note: this is only used for small screens
    const [showFilter, setShowFilter] = useState(false)

    const priceHelpText = 'This graph represents the price of each station, relative to each other. Each bar has the same range on the x-axis.'
    const foodHelpText = 'This graph represents the availability of ethnic food near the station. Ethnic food is defined as Mexican, Thai, and Indian, because those are my favorites :)'
    
    return (<>
        <Container showFilter={showFilter}>
            <GraphFilter title="Price" selector='priceScore' helpText={priceHelpText} />
            <GraphFilter title="Ethnic food" selector='restaurantScore' helpText={foodHelpText} />
            <TriButtonFilter title="Near shinkansen?" selector="isNearShinkansen" helpText='If a shinkansen stop is within 3km'/>
            <TriButtonFilter title="Near costco?" selector="isNearCostco" helpText='If a costco is within 12km'/>
            <StyledApplyButton onClick={() => setShowFilter(false)}>Apply</StyledApplyButton>
        </Container>
        <StyledFilterButon showFilter={showFilter} onClick={() => setShowFilter(true)}>Options</StyledFilterButon>
        </>
    )
}