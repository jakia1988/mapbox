import React, { useCallback, useRef, useState } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import nycJSON from './location.json';
import { View, Text } from 'react-native';
import MapDataCard from './MapDataCard';

MapboxGL.setAccessToken('pk.eyJ1IjoiYnAtcG9wY29ybnYiLCJhIjoiY2tlOXJhcXJqMDNlbTJ5bnpwb2k1emo1eCJ9.XfQFSWRJafKmMRp5ULemJA');

const styles = {
  neighborhoods: {
    fillAntialias: true,
    fillColor: '#f4efe8',
    fillOutlineColor: '#d2af82',
    fillOpacity: 0.5,
  },
  selectedNeighborhood: {
    fillAntialias: true,
    fillColor: '#d2af82',
    fillOpacity: 0.84,
  },
  deSelectedNeighborhood: {
    fillAntialias: true,
    fillColor: '#f4efe8',
    fillOpacity: 0.84,
  },
};

function App() {
  const mapRef = useRef(null)
  const shapeFillRef = useRef(null);
  const [currentScreenCords, setCurrentScreenCords] = useState([]);
  const [screenCordsConfig, setScreenCordsConfig] = useState({});


  const onPress = useCallback(async e => {
    let userSelectedCords, currCords = [];
    const {screenPointX, screenPointY} = e.properties;
    
    const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
      [screenPointX, screenPointY],
      null,
      ['nycFill'],
    );

    if (featureCollection.features.length) {
      const {id} = featureCollection.features[0];
      if (Reflect.ownKeys(screenCordsConfig).includes(id)) { 
        !!Reflect.ownKeys(screenCordsConfig) && delete screenCordsConfig[id];
      } else {
        userSelectedCords = Object.assign(screenCordsConfig, {[id]: featureCollection});
        setScreenCordsConfig(userSelectedCords);   
      }
      Reflect.ownKeys(screenCordsConfig).map(item => currCords.push(screenCordsConfig[item].features[0]))
      setCurrentScreenCords(currCords)
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
            zoomLevel={1}
            centerCoordinate={[-73.970895, 40.723279]}
          />

          <MapboxGL.ShapeSource  id="nyc" shape={nycJSON}>
            <MapboxGL.FillLayer id="nycFill" style={styles.neighborhoods} />
          </MapboxGL.ShapeSource>

          {currentScreenCords.length ? (
            <MapboxGL.ShapeSource
              id="selectedNYC"
              shape={{"type": "FeatureCollection", features: currentScreenCords}}>
              <MapboxGL.FillLayer
                ref ={ref => shapeFillRef.current = ref}
                id="selectedNYCFill"
                style={styles.selectedNeighborhood}
              />
            </MapboxGL.ShapeSource>
          ) : null}
        </MapboxGL.MapView>
        <View style={{position:'absolute',  bottom:10,marginLeft:9, marginRight:9,}}>
          <MapDataCard
            selected = {`${Reflect.ownKeys(screenCordsConfig).length}`}
            total = {`${nycJSON.features.length}` }
          />
        </View>
        {/* <View style={{position: 'absolute', top: 0, flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255, 0.8)',}}>
          {   
          !!Reflect.ownKeys(screenCordsConfig) && Reflect.ownKeys(screenCordsConfig).map(item => {
            return <Text key={item} style={{flex: 1}}>{screenCordsConfig[item].features[0].properties.name}</Text> 
           })
          }
        </View>

        <View style={{position: 'absolute', top: 0, right: 0, flex: 1, alignItems: 'flex-end', backgroundColor: 'rgba(255,255,255, 0.8)',}}>
          {   
            <Text style={{flex: 1}}>{`${Reflect.ownKeys(screenCordsConfig).length} / ${nycJSON.features.length}` }</Text> 
          }
        </View>    */}

      </>

  );

}


export default App;
