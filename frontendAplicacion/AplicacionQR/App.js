import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Alert, 
  Text, 
  TextInput,
  TouchableOpacity, 
  Image,
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios'

class SignInScreen extends React.Component {
    state = {
        userName:'',
    }

    onSubmitHandle = (e) => {
        e.preventDefault()
        const json = {
            userName:this.state.userName,
        }

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
            axios.post('https://lectorqr-devf.herokuapp.com/users',json)
                .then(() => {
                    alert('Registro con exito')
                })
                .catch(err => {
                    alert('Correo ya registrado')
                })
            }
    
      }

    _signInAsync = async (e) => {
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
                    this.props.navigation.navigate('App');
                }
            })
            .catch(err => {
                alert(
                    'Awkward',
                    'Usuario no registrado'
                )
            })
            await AsyncStorage.setItem(`${this.state.userName}`, 'abc');
            
    }
  }

   handleUser = (text) => {
      this.setState({ userName: text })
   }

  render() {
    return (
    //     <Button title="Sign in!" onPress={this._signInAsync} />
      <KeyboardAwareScrollView style = {styles.container}>
      <View >
         <Image source={require('./assets/Logo.png')} resizeMode="stretch" style={styles.image}></Image>
         <Image source={require('./assets/TED.png')} resizeMode="stretch" style={styles.image2}></Image>
         <TextInput style = {styles.input}
            placeholder = "Introduce tu correo"
            placeholderTextColor = "grey"
            onChangeText = {this.handleUser}/>
         <TouchableOpacity
            style = {styles.LogInButton}
            onPress = {this._signInAsync}>
            <Text style = {styles.submitButtonText}> Entrar </Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.RegisterButton} onPress={this.onSubmitHandle}><Text>Registrarse</Text></TouchableOpacity>
      </View>
      </KeyboardAwareScrollView>
    );
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Bienvenido a Awkward',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Lots of features here',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="I'm done, sign me out" onPress={this._signOutAsync} />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image:{
    width:320,
    height:150,
    marginLeft:30,
  },
  image2:{
      width:210,
      height:110,
      marginLeft:70,
  },
 input: {
    padding:10,
    height: 40,
    width:220,
    borderColor: '#cfe4fa',
    borderWidth: 1,
    alignItems:"center",
    justifyContent:"center",
    marginTop:60,
    borderRadius:15,
    marginLeft:80,
 },
 LogInButton: {
    backgroundColor: 'black',
    width:150,
    height:30,
    alignItems:"center",
    justifyContent:"center",
    marginTop:20,
    borderRadius:10,
    marginLeft:110,
 },
 RegisterButton:{
    marginTop:20,
    marginLeft:140,
 },
 submitButtonText:{
    color: 'white',
 },
});

const AppStack = createStackNavigator({ Home: HomeScreen, Other: OtherScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
