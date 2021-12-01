import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import { Div, Context } from 'Shared'
import styled from 'styled-components'
import { groupBy, histogram, sleep } from 'utils'
import ReactECharts from 'echarts-for-react'

const Container = styled(Div)`
    flex: 4;
    min-height: 144px;
    max-height: 144px;
`

export default function Graph({buckets}) {
    const options = {
        animation: false,
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
          },
        xAxis: {
            type: 'category',
            show: false
        },
        yAxis: {
            show: false
        },
        series: [{ 
            data: buckets.map(b => { return { 
                value: b.count,
                itemStyle: {
                    color: b.disabled ? '#507070' : '#00AAAF'
                }
            }}),
            type: 'bar',
            groupPadding: 0,
            barCategoryGap: 0,
        }]
    }

    return (
        <Container>
            <ReactECharts
                option={options}
                notMerge={true}
                lazyUpdate={false}
                style={{
                    width: '100%', height: '100%'
                  }}
                //onEvents={EventsDict}
                //opts={}
                />
        </Container>
    )
}