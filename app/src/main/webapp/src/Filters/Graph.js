import { useState, useCallback, useContext, useEffect, useRef } from 'react'
import * as Context from 'Context'
import styled from 'styled-components'
import { groupBy, histogram, sleep } from 'utils'
import ReactECharts from 'echarts-for-react'

const Container = styled.div`
    flex: 4;
    min-height: 144px;
    max-height: 144px;
`

export default function Graph({buckets}) {
    console.log(buckets.map(b => b.count))
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
                    color: b.disabled ? 'grey' : 'blue'
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