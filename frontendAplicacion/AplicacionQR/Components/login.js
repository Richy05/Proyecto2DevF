import React, { Component } from 'react'
import {Alert,View, Text, TextInput,TouchableOpacity, StyleSheet, Image } from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'

class LoginView extends Component {
    state = {
        userName:'',
    }

  onSubmitHandle = (e) => {
    e.preventDefault()
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(this.state.userName === '')
        alert('Introduce tu correo')
    else if(reg.test(this.state.userName) === false){
        this.setState({userName:e})
        alert('Introduce un correo valido')
        return false;
    }
    else{
        this.setState({userName:e})
    
        axios.get(`https://lectorqr-devf.herokuapp.com/users/${this.state.userName}`)
            .then(res => {
                if(res.data === '')
                    alert('Usuario no registrado')
                else{
                    Alert.alert(
                        'Awkward',
                        `Bienvenido ${res.data._id}`
                    )
                }
            })
            .catch(err => {
                alert(
                    'Awkward',
                    'Usuario no registrado'
                )
            })
    }
  }

   handleUser = (text) => {
      this.setState({ userName: text })
   }

   render() {
      return (
        <KeyboardAwareScrollView>
         <View style = {styles.container}>
            <Image source={require('../assets/Logo.png')} resizeMode="stretch" style={styles.image}></Image>
            <Image source={require('../assets/TED.png')} resizeMode="stretch" style={styles.image2}></Image>
            <TextInput style = {styles.input}
               placeholder = "Introduce tu correo"
               placeholderTextColor = "grey"
               onChangeText = {this.handleUser}/>
            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {this.onSubmitHandle}>
               <Text style = {styles.submitButtonText}> Entrar </Text>
            </TouchableOpacity>
            <TouchableOpacity><Text>Registrarse</Text></TouchableOpacity>
         </View>
         </KeyboardAwareScrollView>
      )
   }
}
export default LoginView

const styles = StyleSheet.create({
   container: {
      flex:1,
      alignItems:'center',
      padding:30,
      backgroundColor: 'white'
   },
   image:{
      width:320,
      height:150,
      marginTop:30
    },
    image2:{
        width:220,
        height:130,
        marginTop:30
    },
   input: {
      padding:10,
      height: 40,
      width:220,
      borderColor: '#cfe4fa',
      borderWidth: 1,
      alignItems:"center",
      justifyContent:"center",
      marginTop:50,
      borderRadius:15
   },
   submitButton: {
      margin:15,
      backgroundColor: 'black',
      width:150,
      height:30,
      alignItems:"center",
      justifyContent:"center",
      marginTop:20,
      borderRadius:10,
   },
   submitButtonText:{
      color: 'white',
   }
})