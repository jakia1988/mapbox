import React, { useCallback } from 'react';
import { Animated, View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
const singleImage = require('./place-marker.png');
const multipleImage = require('./marker.png');


const ANNOTATION_SIZE = 45;
MapboxGL.setAccessToken('pk.eyJ1IjoiYnAtcG9wY29ybnYiLCJhIjoiY2tlOXJhcXJqMDNlbTJ5bnpwb2k1emo1eCJ9.XfQFSWRJafKmMRp5ULemJA');

const styles = StyleSheet.create({
    annotationContainer: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'rgba(0, 0, 0, 0.45)',
        borderRadius: ANNOTATION_SIZE / 2,
        borderWidth: StyleSheet.hairlineWidth,
        height: ANNOTATION_SIZE,
        justifyContent: 'center',
        overflow: 'hidden',
        width: ANNOTATION_SIZE,
        flex: 1
    },
    annotationFill: {
        backgroundColor: 'orange',
        borderRadius: (ANNOTATION_SIZE - 3) / 2,
        height: ANNOTATION_SIZE - 3,
        transform: [{ scale: 0.6 }],
        width: ANNOTATION_SIZE - 3,
    },
});


const layerStyles = {

    singlePointImg: {
        iconImage: singleImage,
        textPitchAlignment: 'map',
    },  

    multipleImagePoint: {
        iconImage: multipleImage,
        textPitchAlignment: 'map',
    },
  
    clusterCount: {
      textField: '{point_count}',
      textSize: 16,
      iconImage: multipleImage,
      textPitchAlignment: 'map',
      textColor: 'black'
    },
  };
  

export default function Annotation() {
    const mapRef = React.useRef(null)
    const [currentLocation, setCurrentLocation] = React.useState('')
     
    const onAnnotationPress = React.useCallback((args) => {
       const {coordinates: {latitude, longitude}} = args;
       setCurrentLocation(`${latitude}, ${longitude}`)
    }, [])

    return (
        <>
            <MapboxGL.MapView
                ref={(c) => (mapRef.current = c)}
                style={{ flex: 1, fillColor: '#f4efe8' }}
                styleURL={MapboxGL.StyleURL.Light}
            >
                <MapboxGL.Camera
                    zoomLevel={6}
                    pitch={45}
                    centerCoordinate={[-117.6988297,35.8571663,5.21]}
                />

                <MapboxGL.ShapeSource
                    id="earthquakes"
                    cluster
                    clusterRadius={50}
                    clusterMaxZoom={14}
                    onPress={(e) => onAnnotationPress(e)}
                    url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
                    >

                    <MapboxGL.SymbolLayer
                      id="pointCount"
                      style={layerStyles.clusterCount}
                    />

                    <MapboxGL.SymbolLayer  
                        id="singlePoint"
                        filter={['!', ['has', 'point_count']]}
                        style={layerStyles.singlePointImg}
                    />

                        
                    </MapboxGL.ShapeSource>
     
            </MapboxGL.MapView>
            <View style={{position:'absolute', flex: 1, justifyContent: 'center', alignItems:'center', width: Dimensions.get('window').width, height: 100, bottom: 0, backgroundColor: '#fff'}}>
                <Text>{currentLocation || 'Please select any location'}</Text>
            </View>          

        </>
    )
}
