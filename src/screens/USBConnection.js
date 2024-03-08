import React, { createRef, useState,useEffect } from 'react';
import {Text,View,StyleSheet,NativeModules,Alert} from 'react-native';
import { Button,Switch,CheckBox, Icon, Card } from '@rneui/themed';
import {WebView, WebViewNavigation} from 'react-native-webview';



const USBConnnection=()=> {

const [xcc,setXcc]=useState('');  
const [webvisible,setWebvisible]=useState(false)

let webViewRef = createRef();  
var ssdp = NativeModules.SSDP;


const doConnection=()=> {
  console.log('In connection');
    ssdp.discovery( 'ssdp:all',1.1,5, (msg) => {
      console.log('In Java');
        let matrix;
        matrix=msg.replace('Callback :','');
        matrix=matrix.substring(1, matrix.length-1);
        if(matrix.indexOf('{') > -1){
        matrix=JSON.parse(matrix);
        //Browser.openBrowser('https://' + matrix.ipAddress); 
        setXcc('https://' + matrix.ipAddress); 
        Alert.alert('https://' + matrix.ipAddress) ;
        setWebvisible(true);
        //alert(matrix.ipAddress);
        } else {
            alert('No connection');
        }

    } );
}
  return (
    <>
      {!webvisible ? (<View>
        <Button title='Connect' onPress={() => doConnection()} />
      </View>) : 
      <WebView
        ref={webViewRef}
        source={{ uri: xcc }}
        style={{ flex: 1 }}
        //onLoad={() => hideSpinner()}
        injectedJavaScript={`
        const meta = document.createElement('meta'); 
        meta.setAttribute('content', 'width=device-width,initial-scale=1.2, maximum-scale=1.0, user-scalable=0'); 
        meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
        `
        }
        scalesPageToFit={false}
        
      />}
    </>
  )
}

const styles=StyleSheet.create({
  card:{
    marginTop:40,
    height:'92%',
    borderRadius: 20,
  },
  title:{
    fontSize:40,
    color:'red'
  }
})


export default USBConnnection;


