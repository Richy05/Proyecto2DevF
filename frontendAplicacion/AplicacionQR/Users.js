import React, { Component } from 'react'
import { View, Text } from 'react-native'

class HttpExample extends Component {
   state = {
      data: []
   }
   componentDidMount = () => {
      fetch('https://lectorqr-devf.herokuapp.com/users/', {
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson);
         this.setState({
            data: responseJson
         })
      })
      .catch((error) => {
         console.error(error);
      });
   }
   render() {
      return (
         <View>
            <Text>
               {this.state.data}
            </Text>
         </View>
      )
   }
}
export default HttpExample