import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { ToggleButtonGroup, ToggleButton, createTheme } from '@mui/material'
import { Title } from './FilterBar'
import { ThemeProvider } from '@mui/system'
import { Div, Context } from 'Shared'
import HelpIcon from './HelpIcon'


const Container = styled(Div)`
    position: relative;
    flex-direction: column;
    min-height: 100px;
    max-height: 100px;
`

const theme = createTheme({
    components: {
      // Name of the component
      MuiToggleButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            color: '#E4FFFE',  
            '&.Mui-selected': {
                color: '#E4FFFE',
                backgroundColor: 'rgba(0, 0, 0, 0.18)'

            },         
          },          
        },
      },
    },
  });

export default function TriButtonFilter({title, selector, helpText}) {
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
            <ThemeProvider theme={theme}>
                <Title>{title}</Title>
                <ToggleButtonGroup onChange={filterChange} value={filters[selector]} exclusive>
                    <ToggleButton value="yes">Yes</ToggleButton>
                    <ToggleButton value="no">No</ToggleButton>
                    <ToggleButton value="">Don't care</ToggleButton>
                </ToggleButtonGroup>
                <HelpIcon helpText={helpText} />
            </ThemeProvider>
        </Container>
    )
}