import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,StyleSheet
} from 'react-native'

class HomeView extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Image source={require('../assets/Logo.png')} resizeMode="stretch" style={styles.image}></Image>
                <TouchableOpacity style={styles.boton}>
                    <Text style={styles.ButtonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonR}>
                    <Text style={styles.ButtonText}>Registrarse</Text>
                </TouchableOpacity>
                <Image source={require('../assets/TED.png')} resizeMode="stretch" style={styles.image2}></Image>
            </View>
        )
    }
}

export default HomeView

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        padding:30,
        backgroundColor: 'white'
    },
    image:{
        width:320,
        height:180,
        marginTop:30
    },
    image2:{
        width:240,
        height: 90,
        marginTop: 60
    },  
    boton:{
        height: 36,
        width:270,
        backgroundColor: 'black',
        borderRadius: 8,
        marginTop: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botonR:{
        backgroundColor: 'black',
        width:270,
        height:36,
        borderRadius:8,
        alignItems:"center",
        justifyContent:"center",
        marginTop:10,
    },
    ButtonText:{
        color: 'white',
    }
})