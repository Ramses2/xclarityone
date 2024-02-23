import { Pressable, View, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'

function IconButton({icon,size,color,onPress}) {
    return <Pressable onPress={onPress} style={({pressed}) => pressed && styles.pressed}>
        <View style={styles.buttonContainer}>
            <Icon name={icon}  size={size} color={color}/>
        </View>
    </Pressable>
}

export default IconButton;

const styles=StyleSheet.create({
    buttonContainer:{
        borderRadius:24,
        padding:6,
        marggin:8
    },
    pressed:{
        opacity:0.75
    }
})