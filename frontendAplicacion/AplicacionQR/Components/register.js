import React, { Component } from 'react'
import {Alert, View, Text, TextInput,TouchableOpacity, StyleSheet, Image } from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'

class RegisterView extends Component {
  constructor(props){
    super(props);
    this.state = {
        userName:'',
    }
  }

  onSubmitHandle = () => {
    const json = {
        userName:this.state.userName,
    }
    axios.post('https://lectorqr-devf.herokuapp.com/users',json)
        .then(() => {
            alert('Usuario guardado')
        })
        .catch(err => {
            alert('Tuvimos un error, intenta de nuevo')
        })

  }
   handleUser = (text) => {
      this.setState({ userName: text })
   }

   render() {
      return (
        <KeyboardAwareScrollView>
         <View style = {styles.container}>
            <Image source={require('../assets/Logo.png')} resizeMode="stretch" style={styles.image}></Image>
            <TextInput style = {styles.input}
               placeholder = "Introduce un usuario"
               placeholderTextColor = "grey"
               onChangeText = {this.handleUser}/>
            
            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {this.onSubmitHandle}>
               <Text style = {styles.submitButtonText}> Registrar </Text>
            </TouchableOpacity>
         </View>
         </KeyboardAwareScrollView>
      )
   }
}
export default RegisterView

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
   input: {
      margin: 35,
      padding:10,
      height: 40,
      width:200,
      borderColor: '#cfe4fa',
      borderWidth: 1,
      alignItems:"center",
      justifyContent:"center",
      marginTop:180,
      borderRadius:15
   },
   submitButton: {
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