import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import * as Context from 'Context'
import styled from 'styled-components'
import ListView from './ListView'

const Container = styled.div`

`

export default function ResultsPanel() {
    return (
        <Container>
            <ListView />
        </Container>
    )
}