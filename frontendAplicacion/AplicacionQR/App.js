import React,{Component} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Alert, 
  Text, 
  TextInput,
  TouchableOpacity, 
  Image,
  Linking, 
  Dimensions, 
  LayoutAnimation,
} from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { BarCodeScanner, Permissions } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'

const ACCESS_TOKEN = '_id'

class SignInScreen extends Component {
  constructor(){
    super()

    this.state = {
      userName:''
    }
  }

  storeToken = async(accessToken) => {
    try{
      await AsyncStorage.setItem(ACCESS_TOKEN,accessToken)
    }catch(err){
      console.log('Algo anda mal')
    }
  }

  /*-------------------------------------------------Boton Regitro-----------------------------------------------*/
  onSubmitHandle = (e) => {
    e.preventDefault()
    const json = {
      userName:this.state.userName,
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

    if(this.state.userName === '')
      Alert.alert('Awkward','Introduce tu correo')
    else if(reg.test(this.state.userName) === false)
      Alert.alert('Awkward','Introduce un correo valido')
    else{
      this.setState({userName:e})
      
      axios.post('https://lectorqr-devf.herokuapp.com/users',json)
        .then(() => {
          Alert.alert('Awkward','Registro con exito')
        })
        .catch(err => {
          Alert.alert('Awkward','Correo ya registrado')
        })
    }   
  }

  /*-----------------------------------------------Boton Entrar-----------------------------------------------------*/
  _signInAsync = async (e) => {
    e.preventDefault()

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

    if(this.state.userName === '')
        Alert.alert('Awkward','Introduce tu correo')
    else if(reg.test(this.state.userName) === false)
        Alert.alert('Awkward','Introduce un correo valido')
    else{
      axios.get(`https://lectorqr-devf.herokuapp.com/users/${this.state.userName}`)
        .then(res => {
          if(res.data === '')
            Alert.alert(
              'Awkward',
              'Usuario no registrado'
            )
          else{
            let accessToken = res.data.userName;
            this.storeToken(accessToken)
            this.props.navigation.navigate('App');
          }
        })
        .catch(err => {
          Alert.alert(
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

class HomeScreen extends Component {
  constructor(props){
    super(props)

    this.state = {
      userName:''
    }
  }

  getToken = async () =>{
    try{
      let token = await AsyncStorage.getItem(ACCESS_TOKEN)
       this.setState({userName:token}) 
    }catch(err){
      console.log('Algo anda mal')
    }
  }

  componentDidMount(){
    this.getToken()
  }

  static navigationOptions = {
    title: `Bienvenido a Awkward`,
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.ButtonIcon} onPress={this._showMoreApp} >
          <Icon name={'camera'} size={30} color='#01a699'/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOut} onPress={this._signOutAsync} >
          <Text style={{color:'red',fontSize:25}}>Salir</Text>
        </TouchableOpacity>
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

class OtherScreen extends Component {
  constructor(props){
    super(props)

    this.state = {
      userName:'',
      hasCameraPermission: null,
      lastScannedUrl: null,
    }
  }

  onSubmitHandleC = () => {
    const json = {
      codigos:[{QR:this.state.lastScannedUrl}]
    } 
    Linking.openURL(`http://twitter.com/share?text=${this.state.lastScannedUrl}&hashtags=Awkward,ImAwkwardToo`)

      axios.post(`https://lectorqr-devf.herokuapp.com/users/qr/${this.state.userName}`,json)
        .then(() => {
        })
        .catch(err => {

        })  
  }

  getToken = async () =>{
    try{
      let token = await AsyncStorage.getItem(ACCESS_TOKEN)
       this.setState({userName:token}) 
    }catch(err){
      console.log('Algo anda mal')
    }
  }

  static navigationOptions = {
    title: 'Comparte en Twitter',
  };

  componentDidMount() {
    this._requestCameraPermission();
    this.getToken()
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
    }
  };

  render() {
    return (

      <View style={styles.containerCamera}>

      {this.state.hasCameraPermission === null
        ? <Text>Requesting for camera permission</Text>
        : this.state.hasCameraPermission === false
            ? <Text style={{ color: '#fff' }}>
                Camera permission is not granted
              </Text>
            : <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={{
                  height: Dimensions.get('window').height,
                  width: Dimensions.get('window').width,
                }}
              />}

      {this._maybeRenderUrl()}

      <StatusBar hidden />
      </View>
    );
  }
  

  _handlePressUrl = () => {
    Alert.alert(
      '¿Compartir esto?',
      this.state.lastScannedUrl,
      [
        {
          text: 'Si',
          onPress: () => { this.onSubmitHandleC()
        }
        },
        { text: 'No', onPress: () => {} },
      ],
      { cancellable: false }
    );
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  _maybeRenderUrl = () => {
    if (!this.state.lastScannedUrl) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
          <Text numberOfLines={1} style={styles.urlText}>
            Compartir
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={this._handlePressCancel}>
          <Text style={styles.cancelButtonText}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}

class AuthLoadingScreen extends Component {
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
  containerCamera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
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
 bottomBar: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  padding: 15,
  flexDirection: 'row',
},
url: {
  flex: 1,
},
urlText: {
  color: '#fff',
  fontSize: 20,
},
cancelButton: {
  marginLeft: 10,
  alignItems: 'center',
  justifyContent: 'center',
},
cancelButtonText: {
  color: 'rgba(255,255,255,0.8)',
  fontSize: 18,
},
ButtonIcon:{
  borderWidth:1,
  borderColor:'rgba(0,0,0,0.2)',
  alignItems:'center',
  justifyContent:'center',
  width:100,
  height:100,
  backgroundColor:'white',
  borderRadius:100,
  marginTop:220,
  marginLeft:130,
},
signOut:{
  marginTop:200,
  marginLeft:50,
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
