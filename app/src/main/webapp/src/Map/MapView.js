import React, { useState, useCallback, useContext, useEffect, useRef } from 'react'
import * as Context from 'Context'
import styled from 'styled-components'
import ListView from './ListView'
import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { engName, key } from 'utils'

const Container = styled.div`
    // display: block;
    // > div  {
    //     display: block !important;
    //     width: auto;
    //     height: auto;
    // }
    div {
        display: block;
        height: auto;
        width: auto;
    }
    // display: block;
    // height: auto;
    // width: auto;
`

const render = (status) => {
    switch (status) {
        case Status.LOADING:
          return <h3>Loading...</h3>;
        case Status.FAILURE:
            return <h3>Loading failed</h3>;
        default:
            return <h1>{status}</h1>
      }    
}

const Marker = (options) => {
    const [marker, setMarker] = React.useState(undefined);
  
    React.useEffect(() => {
      if (!marker) {
        setMarker(new window.google.maps.Marker());
      }
  
      // remove marker from map on unmount
      return () => {
        if (marker) {
          marker.setMap(null);
        }
      };
    }, [marker]);
  
    React.useEffect(() => {
      if (marker) {
        marker.setOptions(options);
      }
    }, [marker, options]);
  
    return null;
  };

function MapView({children}) {
    const ref = useRef()
    const [map, setMap] = useState(undefined)    

    useEffect(() => {
        if (ref.current && !map) {
            const center = { lat: 35.6797, lng: 139.7674 };
            const zoom = 11;
            setMap(new window.google.maps.Map(ref.current, {
                center,
                zoom,
                disableDefaultUI: true,
                streetViewControl: false
            }));
        }
    }, [ref, map])

    return (
        <>
            <Container  ref={ref} id="map" />
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                // set the map prop on the child component
                return React.cloneElement(child, { map });
                }
            })}
        </>
    )
}

export default function WrappedMapView() {
    const [filteredStationData] = useContext(Context.FilteredStationDataContext)
    const title = (record) => `${engName(record)} - R:${record.restaurantScore.toFixed(2)} - P:${record.priceScore.toFixed(2)} [${record.isNearShinkansen ? 'S' : ''}${record.isNearCostco ? 'C' : ''}]`
    return (<Wrapper apiKey={'AIzaSyCpumSwwtnzCJRahDjwCnVObKfJLNR60zY'} render={render} >
        <MapView>
            {filteredStationData.slice(0, 50).map(f => <Marker key={key(f)} position={{ lat: f.lat, lng: f.lng }} title={title(f)}/>)}
        </MapView>
    </Wrapper>)
}