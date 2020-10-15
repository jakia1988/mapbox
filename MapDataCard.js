import React, { Component } from 'react';
import { Text, View, Pressable, StyleSheet, Dimensions, ImageBackground } from 'react-native';
const windowWidth = Dimensions.get('window').width;

class MapDataCard extends Component {

  render() {
    const { selected , total, selectedContinent, showDetailedView, userName, continentList } = this.props
    return (
      <>
      <View style={{position: 'relative'}}>
      <View style={{backgroundColor: '#fff', width: 50, position: 'absolute',  top: 0, left: 10, zIndex: 999, transform: [{ rotate: "-20deg" }]}}>
        <Text>logo</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.tabView}>
          {
            !showDetailedView ? (
              <>
                <View style={{width:'50%', marginTop:'4%'}}>
                  <Text style={styles.tabText}>You</Text>
                  <View style={styles.activetabline}></View>
                </View>
              <View style={{width:'50%', marginTop:'4%'}}>
                <Text style={styles.tabText}>BRUISED PASSPORT</Text>
                {/* <View style={styles.activetabline}></View> */}
              </View>
              </>
            ) : (
              <>
                  <View style={{width:'100%', marginTop:'4%'}}>
                    <Text style={styles.tabHeadText}>{`${userName}'s Travel Summary`}</Text>
                  </View>
              </>
            )
          }
          
        </View>
        {/* <View style={styles.horizontalSeperator}></View> */}
        <View style={{flexDirection:'row'}}>
          <View style={{width:'50%', justifyContent:'center'}}>
            <View style={{flexDirection:'row', alignSelf:'center'}}>
              <Text style={styles.countText}>{selected}</Text>
              <Text style={[styles.countText, {opacity:0.2}]}>/{total}</Text>
            </View>
            <Text style={styles.countries}>Countries Visited</Text>
          </View>
          <View style={styles.verticalSeperator}></View>
          <View style={{width:'49%', justifyContent:'center'}}>
            <View style={{flexDirection:'row', alignSelf:'center'}}>
            <Text style={styles.countText}>{selectedContinent}</Text>
              <Text style={[styles.countText, {opacity:0.2}]}>/7</Text>
            </View>
            <Text style={styles.countries}>Continents Visited</Text>
          </View>
        </View>

        {
          showDetailedView &&  
          <View style={{flexDirection:'row',  flexWrap:'wrap',  marginTop: 10}}>
            {
              Reflect.ownKeys(continentList).length && Reflect.ownKeys(continentList).map((continentName, index) => {
                return (
                    <View key={`list${index}`} style={{width:'33%', marginBottom: 20, justifyContent:'center'}}>
                      <View style={{flexDirection:'row', alignSelf:'center'}}>
                        <Text style={styles.countBlackText}>{continentList[continentName].selectedCountry}</Text>
                        <Text style={styles.countBlackText}>/{continentList[continentName].totalCountry}</Text>
                      </View>
                      <View>
                        <Text style={styles.countBlackSmallText}>{continentName}</Text>
                      </View>
                    </View>
                )
              })
            }
            
          </View>
        }

       
       

      </View>
      </View>
      </>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    width:windowWidth,
    height:179,
    backgroundColor:'#FFFFFF',
  },
  tabView:{
    flexDirection:'row', 
    borderBottomWidth:1, 
    borderBottomColor:'rgba(0, 0, 0, 0.05)',
    height:48,
  },
  tabHeadText:{
    fontSize:24,
    lineHeight:34,
    fontFamily:'Roboto-bold',
    color:'#000000',
    alignSelf:'center'
  },
  tabText:{
    fontSize:12,
    lineHeight:14,
    fontFamily:'Roboto-Regular',
    color:'#000000',
    alignSelf:'center'
  },
  activetabline:{
    backgroundColor:'#C79B63', 
    width:'80%', 
    height:2, 
    borderRadius:8, 
    alignSelf:'center', 
    marginTop:'8%'
  },
  verticalSeperator: {
    width:1, 
    height:100, 
    backgroundColor:'#000000',
    marginTop:'4%', 
    opacity:0.3
  },
  countries:{
    fontFamily:'Roboto-Regular',
    fontSize:12,
    lineHeight:14,
    color:'#262626',
    textAlign:'center',
    marginTop:9
  },
  countText:{
    fontSize:35,
    lineHeight:41,
    fontFamily:'Roboto-Bold',
    color:'#C79B63',
    textAlign:'center'
  },
  countBlackText:{
    fontSize:25,
    lineHeight:31,
    fontFamily:'Roboto-Bold',
    color:'#000',
    textAlign:'center'
  },
  countBlackSmallText:{
    fontSize:15,
    lineHeight:21,
    fontFamily:'Roboto-Bold',
    color:'#000',
    textAlign:'center'
  },

})

export default MapDataCard;