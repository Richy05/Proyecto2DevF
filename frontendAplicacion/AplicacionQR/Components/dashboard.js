import React,{Component} from 'react'
import {View,Text} from 'react-native'
import axios from 'axios'

class DashboardView extends Component{
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
                <Text>{this.state.Usuarios.lenght}</Text>
        )
    }
}

export default DashboardView