import React, { useCallback, useRef, useState } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import nycJSON from './location.json';
import { View, Text } from 'react-native';


MapboxGL.setAccessToken('pk.eyJ1IjoiYnAtcG9wY29ybnYiLCJhIjoiY2tlOXJhcXJqMDNlbTJ5bnpwb2k1emo1eCJ9.XfQFSWRJafKmMRp5ULemJA');

const styles = {
  neighborhoods: {
    fillAntialias: true,
    fillColor: '#f4efe8',
    fillOutlineColor: '#d2af82',
    fillOpacity: 0.84,
  },
  selectedNeighborhood: {
    fillAntialias: true,
    fillColor: '#d2af82',
    fillOpacity: 0.84,
  },
};

function RNMapBox() {
  const mapRef = useRef(null)
  const [currentScreenCords, setCurrentScreenCords] = useState({});
  const [screenCordsConfig, setScreenCordsConfig] = useState({});

  const getBoundingBox = (screenCoords) => {
    const maxX = Math.max(screenCoords[0][0], screenCoords[1][0]);
    const minX = Math.min(screenCoords[0][0], screenCoords[1][0]);
    const maxY = Math.max(screenCoords[0][1], screenCoords[1][1]);
    const minY = Math.min(screenCoords[0][1], screenCoords[1][1]);
    return [maxY, maxX, minY, minX];
  }

  const onPress = useCallback(async e => {
    let userSelectedCords;
    const {screenPointX, screenPointY} = e.properties;

    const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
      [screenPointX, screenPointY],
      null,
      ['nycFill'],
    );

    if (featureCollection.features.length) {
      const {communityDistrict} = featureCollection.features[0].properties;
      if (Reflect.ownKeys(screenCordsConfig).includes(communityDistrict.toString())) { 
       
        // setScreenCordsConfig(updatedConfig);
      } else {
        userSelectedCords = Object.assign(screenCordsConfig, {[communityDistrict]: featureCollection});
      }
      setScreenCordsConfig(userSelectedCords);
      setCurrentScreenCords(featureCollection)
    }  
  }, []);

  return (
    <>
        <MapboxGL.MapView
          ref={(c) => (mapRef.current = c)}
          onPress={(e) => onPress(e)}
          style={{flex: 1, fillColor: '#f4efe8'}}
          styleURL={MapboxGL.StyleURL.Light}>
          <MapboxGL.Camera
            zoomLevel={9}
            centerCoordinate={[-73.970895, 40.723279]}
          />

          <MapboxGL.ShapeSource id="nyc" shape={nycJSON}>
            <MapboxGL.FillLayer id="nycFill" style={styles.neighborhoods} />
          </MapboxGL.ShapeSource>

          {!!Reflect.ownKeys(currentScreenCords).length ? (
            <MapboxGL.ShapeSource
              id="selectedNYC"
              shape={currentScreenCords}>
              <MapboxGL.FillLayer
                id="selectedNYCFill"
                style={styles.selectedNeighborhood}
              />
            </MapboxGL.ShapeSource>
          ) : null}
        </MapboxGL.MapView>
        <View style={{position: 'absolute', top: 0, flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255, 0.8)',}}>
          {
           <Text>{
             JSON.stringify(screenCordsConfig)
             }</Text>
          }
        </View>
      </>
  );

}


export default RNMapBox;
