import React from 'react';
import { Animated, View, Text, StyleSheet, Image } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';


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

export default function Annotation() {
    const mapRef = React.useRef(null)
    const pointerRef = React.useRef(null)

    React.useEffect(() => {
        console.log(mapRef.current)
    }, [mapRef])

    return (
        <>
            <MapboxGL.MapView
                ref={(c) => (mapRef.current = c)}
                onPress={(e) => console.log('On Press', e)}
                onDidFinishLoadingMap={(e) => { console.log(e) }}
                style={{ flex: 1, fillColor: '#f4efe8' }}
            >
                <MapboxGL.Camera
                    zoomLevel={16}
                    centerCoordinate={[-73.99155, 40.73581]}
                />

                <MapboxGL.PointAnnotation
                    id="annotation"
                    coordinate={[-73.99155, 40.73581]}
                    title="Annotation View"
                    onDrag={(e) =>
                        console.log('onDrag:', e.properties.id, e.geometry.coordinates)
                    }
                    onDragStart={(e) =>
                        console.log('onDragStart:', e.properties.id, e.geometry.coordinates)
                    }
                    onDragEnd={(e) =>
                        console.log('onDragEnd:', e.properties.id, e.geometry.coordinates)
                    }
                    ref={(c) => (pointerRef.current = c)}>
                    <View style={styles.annotationContainer}>
                        <Image
                            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
                            style={{ width: ANNOTATION_SIZE, height: ANNOTATION_SIZE }}
                            onLoad={() => pointerRef.current.refresh()}
                        />
                    </View>
                    <MapboxGL.Callout>
                        <View style={{position: 'absolute', bottom: 0, backgroundColor: 'red'}}>
                             <Text>Hi hidden msg</Text>
                        </View>
                    </MapboxGL.Callout>
                </MapboxGL.PointAnnotation>
            </MapboxGL.MapView>


        </>
    )
}
