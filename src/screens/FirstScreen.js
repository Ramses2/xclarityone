import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import XclarityBrowser from "./XclarityBrowser";
import XclarityConfiguration from './XclarityConfiguration';
import { GlobalStyles } from '../../constants/style';
import IconButton from '../../components/UI/IconButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import USBConnection from './USBConnection';
import ThinkShield from './ThinkShield';


const BottomTabs=createBottomTabNavigator();

export default function FirstScreen() {
 /*  return (
    <View>
      <View style={styles.back}>
        <Text style={styles.title}>XClarity One</Text>
      </View>

      <TouchableOpacity
        //onPress={onAuthenticate}
        style={styles.btn}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
    </View>
  ); */

  

 
  return (
    
  <BottomTabs.Navigator 
  screenOptions={({navigation})=> ({
    headerStyle:{backgroundColor:GlobalStyles.colors.primary500},
    headerTintColor:'white',
    tabBarStyle:{backgroundColor:GlobalStyles.colors.accent500,height:60,borderColor:'#fff'},
    tabBarActiveTintColor:GlobalStyles.colors.primary500
  })}>
    <BottomTabs.Screen name="XClarity One" component={XclarityBrowser} options={{
      tile: 'XclarityBrowser',
      tabBarLabelStyle:{fontSize:12},
      tabBarLebel:'Recent',
      tabBarIcon:({color, size})=><Ionicons name="cloud" size={40} color={color}/>,
      
    
    }}/>
    <BottomTabs.Screen name="Configuration" component={XclarityConfiguration} options={{
      tile: 'Configuration',
      tabBarLabelStyle:{fontSize:12},
      tabBarLebel:'Configuration',
      tabBarIcon:({color, size})=><Ionicons name="cog" size={40} color={color}/>
    
    }}/>
    <BottomTabs.Screen name="USB Connection" component={USBConnection} options={{
      tile: 'USBConnection',
      tabBarLabelStyle:{fontSize:12},
      tabBarLebel:'USBConnection',
      tabBarIcon:({color, size})=><Ionicons name="bluetooth" size={40} color={color}/>
    
    }}/>
    <BottomTabs.Screen name="ThinkShield" component={ThinkShield} options={{
      tile: 'ThinkShield',
      tabBarLabelStyle:{fontSize:12},
      tabBarLebel:'ThinkShield',
      tabBarIcon:({color, size})=><Ionicons name="shield-half" size={40} color={color}/>
    
    }}/>
  </BottomTabs.Navigator>
  
  )
}


const styles = StyleSheet.create({
  btn: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 80,
    backgroundColor: 'gray',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  title: {
    fontSize: 50,
    fontWeight: '400',
    marginVertical: 30,
    textAlign: 'center',
    color: 'red',
  },
  description: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 50,
  },
  back: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
  },
});