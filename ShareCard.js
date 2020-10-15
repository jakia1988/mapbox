import React from 'react'
import { Image, View, Dimensions } from 'react-native'

export default function ShareCard({imgUrl}) {
    const [screenSize] = React.useState(Dimensions.get('window'));

    console.log(imgUrl)
    return (
        <View style={{position: 'absolute', top: 0, width: screenSize.width, height: screenSize.height, backgroundColor: '#000' }}>
            <View style={{flex:1}}>
            <Image 
                source={{
                    uri: imgUrl
                }}
               width={screenSize.width} 
               height={screenSize.height}
              />

            </View>
          
        </View>
    )
}
