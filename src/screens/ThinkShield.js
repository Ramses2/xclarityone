import  React from "react";
import {Text,View,StyleSheet} from 'react-native';
import { Button,Switch,CheckBox, Icon, Card } from '@rneui/themed';


const ThinkShield=()=> {
  return (
    <View>
      <Card containerStyle={styles.card}>
      <Text style={styles.title}> In developement </Text>

      </Card>
    </View>
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


export default ThinkShield;


