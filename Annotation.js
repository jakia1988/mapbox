import React, { useCallback } from 'react';
import { Animated, View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import annotationJSON from './annotation.json';
import { isNil } from 'lodash';
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
    const [currentLocation, setCurrentLocation] = React.useState('');
    const [imageURL, setImageURL] = React.useState('');
     
    const onAnnotationPress = React.useCallback((args) => {
       const {features, coordinates: {latitude, longitude}} = args;
       const {properties} = features[0];
       setCurrentLocation(`${latitude}, ${longitude}`);
       if (Reflect.ownKeys(properties).includes('display_image')) {
           const {display_image} = properties;
            !isNil(display_image) ? setImageURL(`https://bp-strapi.popcornv.com${display_image?.formats?.thumbnail?.url}`) : setImageURL('');
            console.log(`https://bp-strapi.popcornv.com${display_image?.formats?.thumbnail?.url}`);
       } else {
           setImageURL('');
       }
       
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
                    centerCoordinate={[ 32.56, 25.225]}
                />

                <MapboxGL.ShapeSource
                    id="earthquakes"
                    cluster
                    clusterRadius={50}
                    clusterMaxZoom={14}
                    onPress={(e) => onAnnotationPress(e)}
                    shape={annotationJSON.data}
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
                <View style={{position:'absolute', flex: 1, justifyContent: 'center', alignItems:'center', width: Dimensions.get('window').width, height: 200, bottom: 0, backgroundColor: '#fff'}}>
                    {
                        !!imageURL.length && 
                        <Image 
                        source={{
                            uri: imageURL
                        }}
                        style={{height: 200, width: Dimensions.get('window').width}}
                        />
                    }
                </View>          

        </>
    )
}
