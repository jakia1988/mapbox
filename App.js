import React, { useCallback, useEffect, useRef, useState } from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Share from "react-native-share";
import ViewShot, {captureRef} from "react-native-view-shot";
import { groupBy, invertBy, isNil, uniqBy } from 'lodash';
import { View, Button, Dimensions, Text } from 'react-native';
import continentList from './continentList.json';
import MapDataCard from './MapDataCard';
import LocationService from './locationService';
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
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [mapHeight, setMapheight] = useState(150);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [centerCoordinate, setCenterCoordinates] = useState([12.690006,55.609991]);


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
      const { id } = featureCollection.features[0];
      if (Reflect.ownKeys(screenCordsConfig).includes(id)) {
        if (!!Reflect.ownKeys(screenCordsConfig)) {
          delete screenCordsConfig[id];
        } 
      } else {
        userSelectedCords = Object.assign(screenCordsConfig, { [id]: featureCollection.features[0] });
        setScreenCordsConfig(userSelectedCords);
      }


      Reflect.ownKeys(screenCordsConfig).forEach(item => {
        const {properties: {parent}} = screenCordsConfig[item];
        currCords.push(screenCordsConfig[item])
        continents.push(parent);
      })
      // Getting continent Count
      const selectedContinent = [...new Set(continents)].length;
      setContinentCount(selectedContinent);
      const updatedCords = uniqBy([...currentScreenCords, ...currCords], 'id');
      setCurrentScreenCords(updatedCords)
    }
    
  }, [screenCordsConfig]);

  const onShare = useCallback(async () => {
    //setting height of map when sharing map
    const centerCoordinates = currentScreenCords.map(item => item.geometry.coordinates[0]).flat();
    setCenterCoordinates(centerCoordinates[0])
    setZoomLevel(0);

    
    const selectedLocationsIds = currentScreenCords.map(location => location.properties.db_id);
    await locationService.scratchedOnlyTheselocations(selectedLocationsIds);

    setTimeout(() => {
    captureRef(screenshotRef.current, {
      format: "jpg",
      quality: 0.8
    }).then(
      uri => {
          RNFS.readFile(uri, 'base64').then((res) => {
          let urlString = 'data:image/jpeg;base64,' + res;
          let options = {
            title: 'Travel Summary',
            message: 'Alyssa Travel Summary',
            url: urlString,
            type: 'image/jpeg',
          };
          Share.open(options)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              err && console.log(err);
            });
            
        });
      },
      error => {
        console.error("Oops, snapshot failed", error);
        // setShowDetailedView(false);
      }
    ).finally(() => {
      setShowDetailedView(false);
      setMapheight(150)
    });
    }, 10)
    
  }, [currentScreenCords, zoomLevel, centerCoordinate]);


  return (
    <>
   
      {
        !!Reflect.ownKeys(mapLocation).length && 
        <>
            <ViewShot 
              ref={ref => screenshotRef.current = ref} style={{position: 'relative', flex: 1, backgroundColor: '#fff'}}>  
              <MapboxGL.MapView
                ref={(c) => (mapRef.current = c)}
                onPress={(e) => onPress(e)}
                showUserLocation
                style={{ fillColor: '#f4efe8', position:'relative', height: Dimensions.get('window').height - mapHeight }}
                styleURL={MapboxGL.StyleURL.Light}>
                <MapboxGL.Camera
                  zoomLevel={zoomLevel}
                  centerCoordinate={centerCoordinate}
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
             <MapDataCard
                  selected={`${currentScreenCords.length}`}
                  selectedContinent = {continentCount}
                  total={`${mapLocation.features.length}`}
                  showDetailedView = {showDetailedView}
                  userName = {'Alyssa'}
                  continentList = {continentList}
                />
           </ViewShot>
            
            </>
      }
          <View style={{ position: 'absolute', right: 10, top: 10, marginLeft: 9, zIndex: 99, marginRight: 9, }}>
              <Button
                color="#f194ff"
                title="Capture and Share"
                onPress={() => onShare()}
             />
            </View>
   </>
   
  );

}


export default App;
