import React, {useEffect,useState} from "react";
import {View, Text, StyleSheet,StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import XclarityBrowser from "./src/screens/XclarityBrowser";
import FirstScreen from "./src/screens/FirstScreen";
import XcalrityPush from "./src/screens/XclarityPush";
import { GlobalStyles } from './constants/style';
import IconButton from './components/UI/IconButton';
import SplashScreen from "./components/SplahScreen";
//import TestAxios from "./src/screens/TestAxios";

const Stack=createNativeStackNavigator();
const BottomTabs=createBottomTabNavigator();

const App=()=> {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setIsAppReady(true);
  }, []);
  return (
    
    <>
      {/* <XcalrityPush /> */}
      <SplashScreen isAppReady={isAppReady}>
      <StatusBar
        animated={true}
        backgroundColor="black"
        //barStyle={statusBarStyle}
        //showHideTransition={statusBarTransition}
        hidden={true}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={({
          headerStyle:{backgroundColor:GlobalStyles.colors.primary500},
          headerTintColor:'white'
        })}>
          <Stack.Screen name="Athentication" component={FirstScreen} options={{headerShown:false}} />
          <Stack.Screen name="Lenovo XClarity One" component={XclarityBrowser} options={{presentation:'modal'}}/>
        </Stack.Navigator>
      </NavigationContainer>
      </SplashScreen>
      </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App

