import React, { createRef, useState,useEffect } from 'react';
import {View, StyleSheet, NativeSyntheticEvent,ActivityIndicator,Image} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import { WebViewMessage } from 'react-native-webview/lib/WebViewTypes';
import DeviceInfo from 'react-native-device-info';
import uuid from 'react-native-uuid';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, {Importance} from 'react-native-push-notification';
import messaging from "@react-native-firebase/messaging";
import {fetch} from 'react-native-ssl-pinning';
import { Card } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import DefaultImage from '../assets/events-critical.png';

const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;


export default function XclarityBrowser() {

  const [webCookie, setWebCookie]=useState<any | null>(null);
  const deviceId = JSON.stringify(DeviceInfo.getUniqueId());
  const appUUID = JSON.stringify(uuid.v4()); 
  const [accessToken, setAccessToken]=useState('');
  const [refreshToken, setRefreshToken]=useState(''); 
  const [visible, setVisible] = useState(true)
  console.log('Device uuid:',deviceId); 
  console.log('App UUID:',appUUID)  

  /* CookieManager.set('https://10.241.35.231/', {
  name: 'appUUID',
  value: appUUID,
  domain: '',
  path: '/',
  version: '1',
  expires: '2015-05-30T12:30:00.00-05:00'
}).then((done) => {
  console.log('CookieManager.set =>', done);
});
 */
  //'https://qa1-xclarityone.lenovo.com/'
  /* CookieManager.get('https://10.241.35.231/')
  .then((cookies) => {
    console.log('CookieManager.get =>', cookies);
    let ck=cookies;
    console.log(ck.ak_bmsc.value)
  }); */

  const CHECK_COOKIE = `
  ReactNativeWebView.postMessage("Cookie: " + document.cookie);
  true;
`;

const onNavigationStateChange = (navigationState: WebViewNavigation) => {
  if (webViewRef.current) {
    webViewRef.current.injectJavaScript(CHECK_COOKIE);
  }
};

const storeAccessToken = async (accessToken) => {
  console.log('AccessToken:', accessToken);
  try {
      await AsyncStorage.setItem('accessToken', accessToken); 
      setAccessToken(accessToken);           
  } catch (error) {
      console.log('Eroare la setare access token:', error)
  }
};

const storeRefreshToken = async (refreshToken) => {
  console.log('RefreshToken:', refreshToken);
  try {
      await AsyncStorage.setItem('refreshToken', refreshToken); 
      setRefreshToken(refreshToken);           
  } catch (error) {
      console.log('Eroare la setare refresh token:', error)
  }
};

/* const onMessage = (event: NativeSyntheticEvent<WebViewMessage>) => {
  const { data } = event.nativeEvent;

  if (data.includes('Cookie:')) {
    var ncoockie = data;
    console.log(ncoockie);
    setWebCookie(ncoockie);
  }
}; */



let webViewRef = createRef<WebView>();
/* const LoginWebView: FunctionComponent = () => (
  <WebView
    ref={webViewRef}
    source={{ uri: 'https://google.com/' }}
    onNavigationStateChange={onNavigationStateChange}
    onMessage={onMessage}
  />
); */

const createChannel=(channelId)=> {
  PushNotification.createChannel(
    {
      channelId: channelId, // (required)
      channelName: "My channel", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );  
}
const showNotification=(channelId,options)=> {
  PushNotification.localNotification({
    channelId: channelId, // (required) channelId, if the channel doesn't exist, notification will not trigger.
    largeIconUrl: DEFAULT_IMAGE, // (optional) default: undefined
    smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    bigText: options.bigText, // (optional) default: "message" prop
    subText: options.subText, // (optional) default: none
    bigPictureUrl: options.bigImage, // (optional) default: undefined
    bigLargeIcon: "ic_launcher", // (optional) default: undefined
    bigLargeIconUrl: DEFAULT_IMAGE, // (optional) default: undefined
    color: options.color, // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    priority: "high", // (optional) set notification priority, default: high
    //actions: ["Reply"], // (Android only) See the doc for notification actions to know more
    //reply_placeholder_text: "Write your response...", // (required)
    //reply_button_text: "Reply", // (required)
    title: options.title, // (optional)
    message: options.message, // (required)
  });
}


//const [savedToken,setSavedToken] = useState('')

const storeToken = async (token) => {
  console.log('Token for store:', token);
  try {
    await AsyncStorage.setItem('appToken', token);    
  } catch (error) {
    console.log('Eroare la setare:', error)
  }
};

const sendFcmToken = async (accessToken) => {
  console.log('Start')
  await messaging().registerDeviceForRemoteMessages();
  const existToken = await AsyncStorage.getItem('appToken');
  const token = await messaging().getToken();
  if (existToken === null) {
    storeToken(token);
  }
  console.log('TOKEN:', token);
  console.log('EXIST TOKEN:', existToken);
  
  if (existToken !== token) {
    console.log('SE EXECUTA POST');
    const bodyFetch = {
      filter: "",
      appToken: token,
      appDetails: {
        appUUID: "1111112"
      },
      deviceDetails: {
        deviceUUID: "999",
        osType: "Android"
      }
    }

    fetch("https://10.241.35.231/api/v1/push-service/subscriptions", {
      method: "POST",
      timeoutInterval: 10000,
      body: JSON.stringify(bodyFetch),
      sslPinning: {
        certs: ["xc"]
      },
      headers: {
        Accept: "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "e_platform": "mobile",
        //Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJaZXMwNk92bEFxaExwc0dlalQtT0pzbUR5aktaUy1sMUVaN1hVOURPZUdjIn0.eyJleHAiOjE3MDg1MTk5MTMsImlhdCI6MTcwNzkyMzQzOSwiYXV0aF90aW1lIjoxNzA3OTE1MTEzLCJqdGkiOiJiMjBlOGNjYy0yOTFmLTQ2ZTktOWE1Zi1mNGZlYTg3Yzg1OTgiLCJpc3MiOiJodHRwczovLzEwLjI0MS4zNS4yMzEvaWRwL3JlYWxtcy9BdGxhcyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIwMDA1NzA5ZC0yMzUwLTQwNTAtOGY5Yi00MGMwMWNjYmJjYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJmcm9udGVuZCIsIm5vbmNlIjoiN2ZhNzM2NmEtNWVjYy00YTNlLTllNzgtMWI4NThmZTJiZGU0Iiwic2Vzc2lvbl9zdGF0ZSI6IjM5NzBjYmI0LTY0MmEtNDhhZi04NzhjLWY5YWQ0YWEwZGIwMyIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1hdGxhcyIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiMzk3MGNiYjQtNjQyYS00OGFmLTg3OGMtZjlhZDRhYTBkYjAzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJEYW4gTWF0dWxhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZG1hdHVsYUBsZW5vdm8uY29tIiwiZ2l2ZW5fbmFtZSI6IkRhbiIsImZhbWlseV9uYW1lIjoiTWF0dWxhIiwiZW1haWwiOiJkbWF0dWxhQGxlbm92by5jb20ifQ.h5K28iP4-TOnzkMvuwbrs2CB7IqvIPN34G_SJNudwyRVvgTRsAQzO_TZa9hkYA63u4GoGJv1Vzdf0JznLTVrhUYfdiPwm98XZJIZKvqv9hSbb5kGbPGHg4CrPZFwp-Ld4tdVDBPAk7mxJ-MxfT9jHrPJINaMGAW3yIDUNlWtWDsV6VWM0xQrFjnPbjoUF0maKFVRZPpVXLqbyJ1nl9jTwsWfprIuVRsK6Wg-jsEZUaoYnDNuQWqSiJCfQySTzcDMpQQTJsrgRs-EIEPgwJIvBjCCdcUJylclP2hVEXZwrcpvxAZiPCTU02aiZkGIo1lenxPfBKdTpUIeyYfK8A2p8w',
        Authorization: `Bearer ${accessToken}`

      }
    })
      .then(res => {
        console.log("Response:", res);
        let id = res.headers.Location;
        id = id.slice(id.lastIndexOf('/') + 1);
        storeSubscriptionID(id);
      })
      .catch(err => console.log('Eroare la post:', err))
  }

};

const storeSubscriptionID= async (id)=>{
  console.log('subsID:', id);
  try {
    await AsyncStorage.setItem('subsID', id);
  } catch (error) {
    console.log('Eroare la setare:', error)
  }
}


useEffect(() => {
  /* messaging().getToken(firebase.app().options.messagingSenderId).then((token) => {      
    console.log(`token`, token)

  }) */
  //sendFcmToken();
  AsyncStorage.getItem('severity', (error, result) => {
    if(result === null) {
      AsyncStorage.setItem('severity', "[]");
      AsyncStorage.setItem('clas', "[]");
    }
  });
  
  const unsubscribe = messaging().onMessage(async remoteMsg => {
    const channelId = Math.random().toString(36).substring(7)
    createChannel(channelId)
    showNotification(channelId, { bigImage: remoteMsg.notification.android.imageUrl, title: remoteMsg.notification.title, message: remoteMsg.notification.body, subText: remoteMsg.data.subtitle })
    console.log('remoteMsg', remoteMsg)
  })

  messaging().setBackgroundMessageHandler(async remoteMsg => {
    console.log(`remoteMsg background`, remoteMsg)
  })
  return unsubscribe

}, [])

const hideSpinner=()=> {
  setVisible(false);
}

  return (
    <LinearGradient colors={['#870000', '#190a05', '#ffffff']} style={styles.linearGradient}>
    {/* <Card containerStyle={styles.containerStyle} wrapperStyle={{}}> */}
    {/* <View style={styles.backgroundStyle}> */}
      

      <WebView
        ref={webViewRef}
        source={{uri: 'https://10.241.35.231/'}}
        style={{flex: 1}}
        onLoad={() => hideSpinner()}
        injectedJavaScript={`
          const meta = document.createElement('meta'); 
          meta.setAttribute('content', 'width=device-width,initial-scale=1.2, maximum-scale=1.0, user-scalable=0'); 
          meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);          
          //const tokenSessionStorage = window.sessionStorage.getItem('accessToken');
          //window.ReactNativeWebView.postMessage(tokenSessionStorage);
          let storage = {}
          Object.keys(sessionStorage).forEach((key) => {
          if (key==='refreshToken' || key==='accessToken')  
          storage[key] = sessionStorage.getItem(key);
                    
          });
          window.ReactNativeWebView.postMessage(JSON.stringify(storage));
          
          
          `
          }
          //injectedJavaScriptBeforeContentLoaded={"document.cookie='UUID="+appUUID+"'"}  
          scalesPageToFit={false}
          //onNavigationStateChange={onNavigationStateChange}
          //onMessage={e => {console.log("The access token is:",e.nativeEvent.data); storeData(e.nativeEvent.data);if(accessToken !== '') sendFcmToken(accessToken);}}
          onMessage={e => {
            console.log("The access token is:",e.nativeEvent.data);
            let tokens=JSON.parse(e.nativeEvent.data);
            for (const key in tokens) {
              if (key==='accessToken') {
                console.log('ACCESS TOKEN ESTE: ',tokens[key]);
                storeAccessToken(tokens[key]);
                console.log('The access key is:',accessToken);
                if(accessToken !== '') sendFcmToken(accessToken);
                //if(accessToken !== '') console.log('Se executa FCM');
              }
              if (key==='refreshToken') {
                console.log('REFRESH TOKEN ESTE: ',tokens[key]);
                storeRefreshToken(tokens[key]);
              } 
            }




          
          }}
      />
      {visible && (
        <ActivityIndicator
          style={{ position: "absolute",top:'50%',left:'45%' }}
          size="large"
          color="#00ff00"
        />
      )}
      
    {/* </View> */}
    {/* </Card> */}
    </LinearGradient>
  );



}

const styles = StyleSheet.create({
  backgroundStyle: {
    marginTop: 10,
    backgroundColor: '#F0EEEE',
    height:'98%',
    width:'100%',
    marginRight:15,
    marginLeft:2,
    borderRadius: 5,
    marginHorizontal: 15,
    flexDirection: 'row',
    padding:0
  },
  containerStyle:{
    marginTop:10,
    height:'95%',
    borderRadius: 20,
    marginLeft:0,
    marginRight:0
  },

    inputStyle: {
    flex: 1,
    fontSize: 18,
  },
  iconStyle: {
    fontSize: 35,
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0
  },
  
});