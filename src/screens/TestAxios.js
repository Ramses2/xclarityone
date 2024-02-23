import React, { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
//import axios from 'axios';
import {fetch} from 'react-native-ssl-pinning';





export default function TestAxios() {

  const sendFcmToken = async () => {
    try {
      console.log('Start')
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('TOKEN:',token);

      const bodyFetch = {
        filter: "",
        appDetails: {
          appUUID: "1111112",
          appToken: token
        },
        deviceDetails: {
          deviceUUID: "999",
          osType: "Android"
        }
      }

      console.log('the sent body is:',JSON.stringify(bodyFetch));

      fetch("https://10.241.35.231/api/v1/push-service/subscriptions", {
        method: "POST",
        timeoutInterval: 10000,
        body: JSON.stringify(bodyFetch),
        sslPinning: {
          certs: ["xc"]
        },
        headers: {
          Accept: "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "e_platform": "mobile",
          Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJaZXMwNk92bEFxaExwc0dlalQtT0pzbUR5aktaUy1sMUVaN1hVOURPZUdjIn0.eyJleHAiOjE3MDczOTUyMzgsImlhdCI6MTcwNjc5Njc1NSwiYXV0aF90aW1lIjoxNzA2NzkwNDM4LCJqdGkiOiJmY2FlYTllMi1kNWE2LTQ4MmEtOGQ0ZS1iOTBhZTY2ZjRhNjIiLCJpc3MiOiJodHRwczovLzEwLjI0MS4zNS4yMzEvaWRwL3JlYWxtcy9BdGxhcyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIwMDA1NzA5ZC0yMzUwLTQwNTAtOGY5Yi00MGMwMWNjYmJjYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJmcm9udGVuZCIsIm5vbmNlIjoiMGE0ODZjNDctYTliNy00ZmY2LWJhNjItNTVlNzY4MjYyMTA3Iiwic2Vzc2lvbl9zdGF0ZSI6ImEyMWU4NGUzLWEwYzQtNGIzNi05YTE1LWQzZjQyYzg4ODY0MSIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1hdGxhcyIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiYTIxZTg0ZTMtYTBjNC00YjM2LTlhMTUtZDNmNDJjODg4NjQxIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJEYW4gTWF0dWxhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZG1hdHVsYUBsZW5vdm8uY29tIiwiZ2l2ZW5fbmFtZSI6IkRhbiIsImZhbWlseV9uYW1lIjoiTWF0dWxhIiwiZW1haWwiOiJkbWF0dWxhQGxlbm92by5jb20ifQ.OfCE24HFvPNA88J9shf3zh5qrVPtqoa8QCZZSQi-iEfW8SM30uQ2jkI9j6pNNI_ygulfGgEueB5A8q12l16Xy80l16kRVrrAtwCDldy8N9TCtViFGwuTelaXArvoIl0Z0jD0xfTzSAom5X8K8EXDzjb7VZNhM3Wv-HNE4mVVsziIBidtEIkqzwa2Lb_KstUDL6ig6nVsTLA8AWex6zXg-1X5Z7nvuv11LE6N_1LNd_Opvh-aeWzIXBf6nH1sOkYPkyP29JP1E6ECacuhdozYdIMZd9aGIYOMls5R1qGWUjaU791NasbIjIPdvWX8MYw6d064RPNlNnt6TxCDp2RtJA',
          //Orgid: '227A0661A9514BC88D83095B9E39EDFC'

        }
      })
        .then(res => console.log("Response:", res))
        .catch(err => console.log('Eroare:', err))
    } catch (err) {
      console.log(err.response.data);
      return;
    }
  };

   

 
    

useEffect(() => {
  sendFcmToken()
}, []);
}










