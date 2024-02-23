import React, {useEffect,useState} from "react";
import PushNotification, {Importance} from 'react-native-push-notification';
import messaging from "@react-native-firebase/messaging";
import {fetch} from 'react-native-ssl-pinning';
//import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function XcalrityPush() {
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
      largeIconUrl: "https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/react-128.png", // (optional) default: undefined
      smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
      bigText: options.bigText, // (optional) default: "message" prop
      subText: options.subText, // (optional) default: none
      bigPictureUrl: options.bigImage, // (optional) default: undefined
      bigLargeIcon: "ic_launcher", // (optional) default: undefined
      bigLargeIconUrl: "https://cdn0.iconfinder.com/data/icons/logos-brands-in-colors/128/react_color-512.png", // (optional) default: undefined
      color: options.color, // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      priority: "high", // (optional) set notification priority, default: high
      actions: ["Reply"], // (Android only) See the doc for notification actions to know more
      reply_placeholder_text: "Write your response...", // (required)
      reply_button_text: "Reply", // (required)
      title: options.title, // (optional)
      message: options.message, // (required)
    });
  }


  //const [savedToken,setSavedToken] = useState('')

  const storeData = async (token) => {
    console.log('Token for store:', token);
    try {
      await AsyncStorage.setItem('appToken', token);
      await AsyncStorage.setItem('severity', "[]");
    } catch (error) {
      console.log('Eroare la setare:', error)
    }
  };

  const sendFcmToken = async () => {
    console.log('Start')
    await messaging().registerDeviceForRemoteMessages();
    const existToken = await AsyncStorage.getItem('appToken');
    const token = await messaging().getToken();
    if (existToken === null) {
      storeData(token);
    }
    console.log('TOKEN:', token);
    console.log('EXIST TOKEN:', existToken);
    
    if (existToken !== token) {
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
          Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJaZXMwNk92bEFxaExwc0dlalQtT0pzbUR5aktaUy1sMUVaN1hVOURPZUdjIn0.eyJleHAiOjE3MDg1MTk5MTMsImlhdCI6MTcwNzkyMzQzOSwiYXV0aF90aW1lIjoxNzA3OTE1MTEzLCJqdGkiOiJiMjBlOGNjYy0yOTFmLTQ2ZTktOWE1Zi1mNGZlYTg3Yzg1OTgiLCJpc3MiOiJodHRwczovLzEwLjI0MS4zNS4yMzEvaWRwL3JlYWxtcy9BdGxhcyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIwMDA1NzA5ZC0yMzUwLTQwNTAtOGY5Yi00MGMwMWNjYmJjYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJmcm9udGVuZCIsIm5vbmNlIjoiN2ZhNzM2NmEtNWVjYy00YTNlLTllNzgtMWI4NThmZTJiZGU0Iiwic2Vzc2lvbl9zdGF0ZSI6IjM5NzBjYmI0LTY0MmEtNDhhZi04NzhjLWY5YWQ0YWEwZGIwMyIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1hdGxhcyIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiMzk3MGNiYjQtNjQyYS00OGFmLTg3OGMtZjlhZDRhYTBkYjAzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJEYW4gTWF0dWxhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZG1hdHVsYUBsZW5vdm8uY29tIiwiZ2l2ZW5fbmFtZSI6IkRhbiIsImZhbWlseV9uYW1lIjoiTWF0dWxhIiwiZW1haWwiOiJkbWF0dWxhQGxlbm92by5jb20ifQ.h5K28iP4-TOnzkMvuwbrs2CB7IqvIPN34G_SJNudwyRVvgTRsAQzO_TZa9hkYA63u4GoGJv1Vzdf0JznLTVrhUYfdiPwm98XZJIZKvqv9hSbb5kGbPGHg4CrPZFwp-Ld4tdVDBPAk7mxJ-MxfT9jHrPJINaMGAW3yIDUNlWtWDsV6VWM0xQrFjnPbjoUF0maKFVRZPpVXLqbyJ1nl9jTwsWfprIuVRsK6Wg-jsEZUaoYnDNuQWqSiJCfQySTzcDMpQQTJsrgRs-EIEPgwJIvBjCCdcUJylclP2hVEXZwrcpvxAZiPCTU02aiZkGIo1lenxPfBKdTpUIeyYfK8A2p8w',
          //Orgid: '227A0661A9514BC88D83095B9E39EDFC'

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
    sendFcmToken();
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


}




