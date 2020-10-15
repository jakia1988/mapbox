import React, { useCallback, useEffect, useRef, useState } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Share from "react-native-share";
import ViewShot from "react-native-view-shot";
import { View, Button } from 'react-native';
import MapDataCard from './MapDataCard';
import LocationService from './locationService';
import { groupBy, invertBy, isNil, uniqBy } from 'lodash';
import ShareCard from './ShareCard';
const RNFS = require('react-native-fs');



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
  const screenshotRef = useRef(null);
  const [imageMapURL, setMapImageUrl] = useState(null);
  const [locationService] = useState(new LocationService());
  const [mapLocation, setMapLocations] = useState({});
  const [currentScreenCords, setCurrentScreenCords] = useState([]);
  const [continentCount, setContinentCount] = useState(0);
  const [screenCordsConfig, setScreenCordsConfig] = useState({});


  useEffect(() => {
    fetchLocation();
  }, [])

  const fetchLocation = useCallback(async () => {
    const continents = [];
    const {selectedLocation, locations} = await locationService.getAllLocation();
     setMapLocations(locations);
     if (selectedLocation.length > 0) {
      const screenConfig = groupBy(selectedLocation, 'id') 
      Reflect.ownKeys(screenConfig).forEach(item => {
        screenConfig[item] = screenConfig[item][0];
        continents.push(screenConfig[item].properties.parent)
      })
      const selectedContinent = [...new Set(continents)].length;
      setContinentCount(selectedContinent);
      setScreenCordsConfig(screenConfig);
      setCurrentScreenCords(selectedLocation)
     }

    }, [])

  const onPress = useCallback(async e => {
    let userSelectedCords, currCords = [],  continents = [];
    const { screenPointX, screenPointY } = e.properties;
    const featureCollection = await mapRef.current.queryRenderedFeaturesAtPoint(
      [screenPointX, screenPointY],
      null,
      ['nycFill'],
    );

    if (featureCollection.features.length) {
      const { id, properties: {db_id} } = featureCollection.features[0];
      if (Reflect.ownKeys(screenCordsConfig).includes(id)) {
        if (!!Reflect.ownKeys(screenCordsConfig)) {
          await locationService.removeSelectedLocation(db_id);
          delete screenCordsConfig[id];
        } 
      } else {
        await locationService.addSelectedLocation(db_id);
        userSelectedCords = Object.assign(screenCordsConfig, { [id]: featureCollection });
        setScreenCordsConfig(userSelectedCords);
      }
      Reflect.ownKeys(screenCordsConfig).forEach(item => {
        const {properties: {parent}} = screenCordsConfig[item].features[0];
        currCords.push(screenCordsConfig[item].features[0])
        continents.push(parent);
      })
      // Getting continent Count
      const selectedContinent = [...new Set(continents)].length;
      setContinentCount(selectedContinent);
      const updatedCords = uniqBy([...currentScreenCords, ...currCords], 'id');
      setCurrentScreenCords(updatedCords)
    }
    
  }, []);

  const onShare = useCallback(() => {
    screenshotRef.current.capture().then(uri => {
      RNFS.readFile(uri, 'base64').then((res) => {
        let urlString = 'data:image/png;base64,' + res;
        setMapImageUrl(uri)
      });
    });
  }, [])

  return (
    <>
    <ViewShot 
      ref={ref => screenshotRef.current = ref} style={{flex: 2}}>
      {
        !!Reflect.ownKeys(mapLocation).length && 
        <>
            <MapboxGL.MapView
              ref={(c) => (mapRef.current = c)}
              onPress={(e) => onPress(e)}
              style={{ flex: 1, fillColor: '#f4efe8' }}
              styleURL={MapboxGL.StyleURL.Light}>
              <MapboxGL.Camera
                zoomLevel={1}
                centerCoordinate={[12.690006,55.609991]}
              />

              <MapboxGL.ShapeSource id="nyc" shape={mapLocation}>
                <MapboxGL.FillLayer id="nycFill" style={styles.neighborhoods} />
              </MapboxGL.ShapeSource>

              {currentScreenCords.length ? (
                <MapboxGL.ShapeSource
                  id="selectedNYC"
                  shape={{ "type": "FeatureCollection", features: currentScreenCords }}>
                  <MapboxGL.FillLayer
                    ref={ref => shapeFillRef.current = ref}
                    id="selectedNYCFill"
                    style={styles.selectedNeighborhood}
                  />
                </MapboxGL.ShapeSource>
              ) : null}

            </MapboxGL.MapView>

            <View style={{ position: 'absolute', bottom: 10, marginLeft: 9, marginRight: 9, }}>
                <MapDataCard
                  selected={`${currentScreenCords.length}`}
                  selectedContinent = {continentCount}
                  total={`${mapLocation.features.length}`}
                />
            </View>
            <View style={{ position: 'absolute', right: 10, top: 10, marginLeft: 9, marginRight: 9, }}>
              <Button
                color="#f194ff"
                title="Capture and Share"
                onPress={onShare}
             />
            </View>
            </>
      }
   </ViewShot>
    {
      !isNil(imageMapURL) &&  <ShareCard imgUrl={imageMapURL}  />
    }  
   

   </>
   
  );

}


export default App;
