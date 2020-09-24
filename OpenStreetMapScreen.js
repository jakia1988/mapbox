import React, { Component } from 'react';
import {View,StyleSheet,StatusBar,Image,Dimensions} from 'react-native';
import MapView ,{ MAP_TYPES, PROVIDER_DEFAULT,UrlTile } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 22.720555;
const LONGITUDE = 75.858633;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class OpenStreetMapScreen extends React.Component {
    
constructor(props) {
   super(props);
     this.state = {
       region: {
         latitude: LATITUDE,
         longitude: LONGITUDE,
         latitudeDelta: LATITUDE_DELTA,
         longitudeDelta: LONGITUDE_DELTA,
       },
     };
 }
get mapType() {
   return this.props.provider === PROVIDER_DEFAULT ? MAP_TYPES.STANDARD : MAP_TYPES.NONE;
}
render() {
  return (
   <>
     <MapView
       region={this.state.region}
       provider={null}
       mapType={this.mapType}
       rotateEnabled={false}
       style={{flex: 1}}
       style={styles.map}
       showsUserLocation>
       <UrlTile
urlTemplate="http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
maximumZ={19}
/>
      </MapView>
    </>
   );
  }
}
export default OpenStreetMapScreen

const styles = StyleSheet.create({
   map: {
    width: 400,
    height: 800,
   },
});