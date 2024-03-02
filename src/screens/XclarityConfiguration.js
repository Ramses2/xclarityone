import React, { useState,useEffect } from 'react';
import { StyleSheet, View, Text,Alert,Image } from 'react-native';
import { Button,CheckBox, Card,Overlay,Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetch} from 'react-native-ssl-pinning';
//import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import LinearGradient from 'react-native-linear-gradient';



const XclarityConfiguration = ({navigation}) => {
    const [severities, setSeverities] = useState([]);
    const [classes, setClasses] = useState([]);

    const [informational, setInformational] = useState(false);
    const [warning, setWarning] = useState(false);
    const [critical, setCritical] = useState(false);

    const [audit, setAudit] = useState(false);
    const [system, setSystem] = useState(false);

    const [update,setUpdate]=useState(true);

    
    const [checked, setChecked] = useState(true);

    //const [accessToken, setAccessToken] = useState('');
    //const [refreshToken, setRefreshToken]=useState('');

    const [saved, setSaved]=useState(true);

    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
      AsyncStorage.getItem('appToken', (error, result) => {
        if(result === null) {
          setVisible(false); 
          setInformational(false);
          setWarning(false);
          setCritical(false);
          setAudit(false);
          setSystem(false);
          setSaved(true);
          setChecked(false);                   
          navigation.navigate('XClarity One');
        } else {
          setVisible(false);
        }
      })
    };



    const checkPushState = () => {
      severities.length===0 ? setChecked(false) : setChecked(true)
    };
    


    

    useEffect(() => {
      console.log('Navigation:',navigation)
      AsyncStorage.getItem('appToken', (error, result) => {
        if(result === null) {
          setVisible(true);          
        } else {
          setVisible(false)
          getData();
          updateState();
        }
      });        
        
    }, [update===true])

    const storeData = async () => {
        console.log('Severity:', severities);
        console.log('Casses:', classes);
        try {
            await AsyncStorage.setItem('severity', JSON.stringify(severities)); 
            await AsyncStorage.setItem('clas', JSON.stringify(classes));           
        } catch (error) {
            console.log('Eroare la setare:', error)
        }
    };

    const updateState= ()=> {
        setTimeout(() => {
            if (severities.indexOf("informational") !== -1) { setInformational(true); console.log('informational:', informational); }
            if (severities.indexOf("warning") !== -1) { setWarning(true); console.log('warning:', warning); }
            if (severities.indexOf("critical") !== -1) { setCritical(true); console.log('critical:', critical); }
            if (classes.indexOf("audit") !== -1) { setAudit(true); console.log('audit:', audit); }
            if (classes.indexOf("system") !== -1) { setSystem(true); console.log('system:', system); }
            checkPushState();
            setUpdate(false);
            

        }, 200)
    }

    

    const getData = async () => {
        try {
            const severity = await AsyncStorage.getItem('severity');
            const clas = await AsyncStorage.getItem('clas');
            //const accessToken = await AsyncStorage.getItem('accessToken');
            //const refreshToken = await AsyncStorage.getItem('refreshToken');
            const toggle = await AsyncStorage.getItem('toggle');
            console.log('Toggle-----:',toggle);
            
            setChecked(JSON.parse(toggle));
            console.log('Checked-----:',checked);
            //setAccessToken(accessToken);
            //setRefreshToken(refreshToken);
            setSeverities(JSON.parse(severity));
            setClasses(JSON.parse(clas));
        } catch (error) {
            console.log('Eroare la setare:', error)
        }        
    };

    const createFilter = async (type, typeValue) => {
      AsyncStorage.getItem('appToken', (error, result) => {
        if (typeValue !== true && result !== null) {
          if(["informational","warning","critical"].includes(type)) setSeverities([...severities, type]);
          if(["audit","system"].includes(type)) setClasses([...classes, type])            
        } else {
          if(["informational","warning","critical"].includes(type)) {
            const index = severities.indexOf(type)
            severities.splice(index, 1)
          }
          if(["audit","system"].includes(type)) {
            const index = classes.indexOf(type)
            classes.splice(index, 1)
          }
        }
      })
    }

    const saveSeverity = async () => {
        //let newToken=await AsyncStorage.getItem('accessToken');
        //setAccessToken(newToken);
        console.log('Severities:', severities);
        console.log('Classes:', classes);
        checkPushState();
        storeData();
        sendSeveritiesToServer();
        setSaved(true);
    }

  const sendSeveritiesToServer = async () => {
    try {
      /* console.log('Token la configurare:', accessToken);
      const decToken = jwtDecode(accessToken);
      console.log('Decoded Token:', decToken);
      let currentDate = new Date();
      
      if (decToken.exp * 1000 < currentDate.getTime()) {
        console.log('REFRESH token din config:',refreshToken);
        console.log("Token expired.");
        Alert.alert('Token expired. You have to logout and login again!');
        setUpdate(true);
      } else { */
        const value = await AsyncStorage.getItem('appToken');
        const subsid = await AsyncStorage.getItem('subsID');
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (value !== null) {
          // We have data!!
          console.log(subsid);
          console.log('Selected is:', { "severity": severities, "eventClass": classes });
          let filter={ "severity": severities, "eventClass": classes };          

          const bodyFetch = {
            filter: filter,
            appToken: value
          }
          console.log('BODY IS:', JSON.stringify(bodyFetch));          
          fetch(`https://10.241.35.231/api/v1/push-service/subscriptions/${subsid}`, {
            method: "PUT",
            timeoutInterval: 10000,
            body: JSON.stringify(bodyFetch),
            sslPinning: {
              certs: ["xc"]
            },
            headers: {
              Accept: "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "e_platform": "mobile",
              //Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJaZXMwNk92bEFxaExwc0dlalQtT0pzbUR5aktaUy1sMUVaN1hVOURPZUdjIn0.eyJleHAiOjE3MDg1MTk5MTMsImlhdCI6MTcwNzkyMzQzOSwiYXV0aF90aW1lIjoxNzA3OTE1MTEzLCJqdGkiOiJiMjBlOGNjYy0yOTFmLTQ2ZTktOWE1Zi1mNGZlYTg3Yzg1OTgiLCJpc3MiOiJodHRwczovLzEwLjI0MS4zNS4yMzEvaWRwL3JlYWxtcy9BdGxhcyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIwMDA1NzA5ZC0yMzUwLTQwNTAtOGY5Yi00MGMwMWNjYmJjYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJmcm9udGVuZCIsIm5vbmNlIjoiN2ZhNzM2NmEtNWVjYy00YTNlLTllNzgtMWI4NThmZTJiZGU0Iiwic2Vzc2lvbl9zdGF0ZSI6IjM5NzBjYmI0LTY0MmEtNDhhZi04NzhjLWY5YWQ0YWEwZGIwMyIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOltdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1hdGxhcyIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiMzk3MGNiYjQtNjQyYS00OGFmLTg3OGMtZjlhZDRhYTBkYjAzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJEYW4gTWF0dWxhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZG1hdHVsYUBsZW5vdm8uY29tIiwiZ2l2ZW5fbmFtZSI6IkRhbiIsImZhbWlseV9uYW1lIjoiTWF0dWxhIiwiZW1haWwiOiJkbWF0dWxhQGxlbm92by5jb20ifQ.h5K28iP4-TOnzkMvuwbrs2CB7IqvIPN34G_SJNudwyRVvgTRsAQzO_TZa9hkYA63u4GoGJv1Vzdf0JznLTVrhUYfdiPwm98XZJIZKvqv9hSbb5kGbPGHg4CrPZFwp-Ld4tdVDBPAk7mxJ-MxfT9jHrPJINaMGAW3yIDUNlWtWDsV6VWM0xQrFjnPbjoUF0maKFVRZPpVXLqbyJ1nl9jTwsWfprIuVRsK6Wg-jsEZUaoYnDNuQWqSiJCfQySTzcDMpQQTJsrgRs-EIEPgwJIvBjCCdcUJylclP2hVEXZwrcpvxAZiPCTU02aiZkGIo1lenxPfBKdTpUIeyYfK8A2p8w',
              Authorization: `Bearer ${accessToken}`,
              //Orgid: '227A0661A9514BC88D83095B9E39EDFC'

            }

          })
            .then(res => { console.log("Response:", res); })
            .catch(err => console.log('Eroare:', err))
        //}
      }
    } catch (error) {
      console.log('Eroare:', error)
      // Error retrieving data
    }

  };


  
    
   

return (
  <>
  <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
      <Text style={styles.textPrimary}>Subscription not initialized!</Text>
      <Text style={styles.textSecondary}>
        Lgin in Xclarity One
      </Text>
      <Button
        color='#870000'
        title="OK"
        onPress={toggleOverlay}
      />
    </Overlay>
  <LinearGradient colors={['#870000', '#190a05', '#ffffff']} style={styles.linearGradient}>
  <Card containerStyle={styles.card}>
    <Card.Title style={{fontSize:25}}>Filter Configuration</Card.Title>
    <Text style={styles.filterTitle}> Event Severity Filter</Text>
    <CheckBox
      checkedIcon={<Image source={require('../assets/events-informational.png')} style={{width:24, height:24}}/>}
      //uncheckedIcon={<Image source={require('../assets/events-informational-disabled.png')} />}
      left
      title="Informational"
      checked={informational}
      onPress={() => {toggleOverlay();setSaved(false);setInformational(!informational);createFilter("informational",informational);}}
      textStyle={informational?{color:'#2196f3',fontSize:20}:styles.uncheckedEvent}
      containerStyle={{backgroundColor:'#f3f3f3',borderRadius:10}}
    />
    <CheckBox
    checkedIcon={<Image source={require('../assets/events-warning.png')} style={{width:24, height:24}}/>}
      left
      title="Warning"
      checked={warning}
      onPress={() => {toggleOverlay();setSaved(false);setWarning(!warning);createFilter("warning",warning);}}
      textStyle={warning?{color:'#ffca28',fontSize:20}:styles.uncheckedEvent}
      containerStyle={{backgroundColor:'#f3f3f3',borderRadius:10}}
    />
    <CheckBox
      checkedIcon={<Image source={require('../assets/events-critical.png')} style={{width:24, height:24}}/>}
      left
      title="Critical"
      checked={critical}
      onPress={() => {toggleOverlay();setSaved(false);setCritical(!critical);createFilter("critical",critical);}}
      textStyle={critical?{color:'#f44336',fontSize:20}:styles.uncheckedEvent}
      containerStyle={{backgroundColor:'#f3f3f3',borderRadius:10}}
      //checkedColor='#870000'
    />

    <Text style={styles.filterTitle}> Event Class Filter</Text>
    
    <CheckBox
      left
      title="audit"
      checked={audit}
      onPress={() => {toggleOverlay();setSaved(false);setAudit(!audit);createFilter("audit",audit);}}
      textStyle={{fontSize:20, color: '#870000'}}
      containerStyle={{backgroundColor:'#f3f3f3',borderRadius:10}}
      checkedColor='#870000'
      

    />
    <CheckBox
      left
      title="system"
      checked={system}
      onPress={() => {toggleOverlay();setSaved(false);setSystem(!system);createFilter("system",system);}}
      textStyle={{fontSize:20, color: '#870000'}}
      containerStyle={{backgroundColor:'#f3f3f3',borderRadius:10}}
      checkedColor='#870000'
      
    />
    
    <View style={styles.buttonView}> 
    <Button
      title="Save event filter"
      loading={false}
      disabled={saved}
      loadingProps={{ size: 'small', color: 'white' }}
      buttonStyle={styles.saveButton}
      titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
      containerStyle={{
        marginHorizontal: 50,
        height: 50,
        width: 200,
        marginVertical: 10,
      }}
      onPress={() => saveSeverity()}
    />
    </View>

    <View style={styles.pushInfo}>
      {checked?<Text style={{...styles.filterTitle, fontSize:15,color:'#870000', fontWeight:'bold'}}>Push notification ON</Text>:<Text style={{...styles.filterTitle, fontSize:15, color:'gray', fontWeight:'bold'}}>Push notification OFF</Text>}
      
    </View>       
    <View style={styles.switchStyle}>
      
    </View>
           
    </Card>
    </LinearGradient>
  </>
);
};

const styles=StyleSheet.create({
  switchStyle : {
    flex:1,
    justifyContent: "left", 
    alignItems: "left", 

  },
  filterTitle:{
    fontSize:20,
    marginLeft:12,
    marginTop:30
  },
  saveButton: {    
    backgroundColor: '#8a1e16',
    borderRadius: 5
  },
  card:{
    marginTop:10,
    height:'95%',
    borderRadius: 20,
    marginLeft:0,
    marginRight:0
  },
  buttonView: {
    marginTop:60,
    flex:1,
    justifyContent: "center", 
    alignItems: "center",
  },
  pushInfo: {
    justifyContent: "left", 
    alignItems: "left",
    marginTop:50
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15
  },
  textPrimary: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 17,
  },
  uncheckedEvent: {
    color:'#d5dadd',
    fontSize:20
  }

})



export default XclarityConfiguration;
