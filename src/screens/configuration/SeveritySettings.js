import React, { useState,useEffect } from 'react';
import { Button } from '@rneui/themed';
import { CheckBox, Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetch} from 'react-native-ssl-pinning';



const SeveritySettings = () => {
    const [severities, setSeverities] = useState([]);
    const [informational, setInformational] = useState(false);
    const [warning, setWarning] = useState(false);
    const [critical, setCritical] = useState(false);
    const [update,setUpdate]=useState(true)

    

    useEffect(() => {
        //AsyncStorage.removeItem('@severity');
        getData();
        updateState();
    }, [update===true])

    const storeData = async () => {
        console.log('Severity:', severities);
        try {
            await AsyncStorage.setItem('severity', JSON.stringify(severities));            
        } catch (error) {
            console.log('Eroare la setare:', error)
        }
    };

    const updateState= ()=> {
        setTimeout(() => {
            if (severities.indexOf("informational") !== -1) { setInformational(true); console.log('informational:', informational); }
            if (severities.indexOf("warning") !== -1) { setWarning(true); console.log('warning:', warning); }
            if (severities.indexOf("critical") !== -1) { setCritical(true); console.log('critical:', critical); }
            setUpdate(false)
        }, 100)
    }

    const getData = async () => {
        try {
            const severity = await AsyncStorage.getItem('severity');
            setSeverities(JSON.parse(severity)); 
        } catch (error) {
            console.log('Eroare la setare:', error)
        }
    };

    const createSeverities = async (type, typeValue) => {
        if (typeValue !== true) {
            setSeverities([...severities, type])
        } else {
            const index = severities.indexOf(type)
            severities.splice(index, 1)
        }
    }

    const saveSeverity = () => {
        console.log('Severities:', severities);
        storeData();
        sendSeveritiesToServer(severities);
    }

    const sendSeveritiesToServer = async (selected) => {
        try {
          const value = await AsyncStorage.getItem('appToken');
          if (value !== null) {
            // We have data!!
            console.log(value);
            console.log('Selected is:',selected);
            const bodyFetch = {
              filter:selected,
              appToken: value,
            }
            console.log('BODY IS:',JSON.stringify(bodyFetch));
            fetch("http://10.241.35.231:30546/api/v1/push-service/subscriptions", {
            method: "PUT",
            timeoutInterval: 10000,
            body: JSON.stringify(bodyFetch),
            sslPinning: {
              certs: ["xc"]
            },
            headers: {
              Accept: "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "e_platform": "mobile",
              Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJaZXMwNk92bEFxaExwc0dlalQtT0pzbUR5aktaUy1sMUVaN1hVOURPZUdjIn0.eyJleHAiOjE3MDg1MTk5MTMsImlhdCI6MTcwNzkyMzQzOSwiYXV0aF90aW1lIjoxNzA3OTE1MTEzLCJqdGkiOiJiMjBlOGNjYy0yOTFmLTQ2ZTktOWE1Zi1mNGZlYTg3Yzg1OTgiLCJpc3MiOiJodHRwczovLzEwLjI0MS4zNS4yMzEvaWRwL3JlYWxtcy9BdGxhcyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIwMDA1NzA5ZC0yMzUwLTQwNTAtOGY5Yi00MGMwMWNjYmJjYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJmcm9udGVuZCIsIm5vbmNlIjoiN2ZhNzM2NmEtNWVjYy00YTNlLTllNzgtMWI4NThmZTJiZGU0Iiwic2Vzc2lvbl9zdGF0ZSI6IjM5NzBjYmI0LTY0MmEtNDhhZi04NzhjLWY5YWQ0YWEwZGIwMyIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1hdGxhcyIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiMzk3MGNiYjQtNjQyYS00OGFmLTg3OGMtZjlhZDRhYTBkYjAzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJEYW4gTWF0dWxhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZG1hdHVsYUBsZW5vdm8uY29tIiwiZ2l2ZW5fbmFtZSI6IkRhbiIsImZhbWlseV9uYW1lIjoiTWF0dWxhIiwiZW1haWwiOiJkbWF0dWxhQGxlbm92by5jb20ifQ.h5K28iP4-TOnzkMvuwbrs2CB7IqvIPN34G_SJNudwyRVvgTRsAQzO_TZa9hkYA63u4GoGJv1Vzdf0JznLTVrhUYfdiPwm98XZJIZKvqv9hSbb5kGbPGHg4CrPZFwp-Ld4tdVDBPAk7mxJ-MxfT9jHrPJINaMGAW3yIDUNlWtWDsV6VWM0xQrFjnPbjoUF0maKFVRZPpVXLqbyJ1nl9jTwsWfprIuVRsK6Wg-jsEZUaoYnDNuQWqSiJCfQySTzcDMpQQTJsrgRs-EIEPgwJIvBjCCdcUJylclP2hVEXZwrcpvxAZiPCTU02aiZkGIo1lenxPfBKdTpUIeyYfK8A2p8w',
              Orgid: '227A0661A9514BC88D83095B9E39EDFC'
    
            }
          })
            .then(res => {console.log("Response:", res); })
            .catch(err => console.log('Eroare:', err))
          }
        } catch (error) {
          console.log('Eroare:',error)
          // Error retrieving data
        }
      };

return (
  <>
    <CheckBox
      left
      title="informational"
      checked={informational}
      onPress={() => {setInformational(!informational);createSeverities("informational",informational);}}
      textStyle={{fontSize:15, color: '#0099cc'}}
      containerStyle={{backgroundColor:'#f3f3f3'}}
    />
    <CheckBox
      left
      title="warning"
      checked={warning}
      onPress={() => {setWarning(!warning);createSeverities("warning",warning);}}
      textStyle={{fontSize:15, color: '#0099cc'}}
      containerStyle={{backgroundColor:'#f3f3f3'}}
    />
    <CheckBox
      left
      title="critical"
      checked={critical}
      onPress={() => {setCritical(!critical);createSeverities("critical",critical);}}
      textStyle={{fontSize:15, color: '#0099cc'}}
      containerStyle={{backgroundColor:'#f3f3f3'}}
    />

<Button
              title="Save event severity"
              loading={false}
              loadingProps={{ size: 'small', color: 'white' }}
              buttonStyle={{
                backgroundColor: 'rgba(111, 202, 186, 1)',
                borderRadius: 5,
              }}
              titleStyle={{ fontWeight: 'bold', fontSize: 15 }}
              containerStyle={{
                marginHorizontal: 50,
                height: 50,
                width: 200,
                marginVertical: 10,
              }}
              onPress={()=>saveSeverity()}
            />

    
  </>
);
};

export default SeveritySettings;