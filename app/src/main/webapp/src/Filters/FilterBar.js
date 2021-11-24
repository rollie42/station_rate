/* eslint-disable no-unused-vars */
import GraphFilter from './GraphFilter'
import styled from 'styled-components'

const Container = styled.div`
    min-width: 22vw;
    max-width: 22vw;
    flex-direction: column;
    background-color: #e1e1e1;
`

export default function FilterBar() {
    return (
        <Container>
            <GraphFilter title="Price" selector='priceScore' />
            <GraphFilter title="Ethnic food" selector='restaurantScore' />
        </Container>
    )
}