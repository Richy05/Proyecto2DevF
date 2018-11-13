import React,{Component} from 'react';
import {View, Text} from 'react-native'
import HomeView from './Components/home'
import RegisterView from './Components/register'
import LoginView from './Components/login'
import axios from 'axios'

class App extends Component{
    constructor(props){
        super(props)
        this.state = {
          Usuarios:[]
        }
      }

    componentDidMount(){
        axios.get('https://lectorqr-devf.herokuapp.com/users')
          .then(response => {
            this.setState({
              Usuarios:response.data
            })
          })
          .catch(err => console.log(err))
      }

    render(){
        return(
            <LoginView />
        )
    }
}
export default App