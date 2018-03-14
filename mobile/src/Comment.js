'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'

export default class Comment extends Component {
  constructor(props){
    super(props)
    this.state = {
      question: '', 
      anom: false,
      color: 'white', 
      borderColor: '#EFEFEF',
      inputHeight: 0
    }
  }

  render() { 
    return (
      <View/>
    )
  }

}