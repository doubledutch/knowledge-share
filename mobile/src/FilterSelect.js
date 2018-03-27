'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'

export default class FilterSelect extends Component {
  constructor(props){
    super(props)
    this.state = {
      filters: []
    }
  }

  render() { 
    return (
      <View style={{flex:1, backgroundColor: 'white'}}>
      {this.topicsHeader()}
      </View>
    )
  }


  topicsHeader = () => {
    return (
      <View style={s.buttonContainer}>
        <Text style={s.title}>Topics</Text>
      </View>
    )
  }
}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
  },
  button1: {
    height: 40,
    paddingTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: client.primaryColor
  },
  button2: {
    height: 40,
    paddingTop: 10,
    marginBottom: 10,
    justifyContent: 'center', 
  },
  divider: {
    flex: 1
  },
  dividerSm: {
    width: 30
  },
  dashboardButton: {
    fontSize: 18,
    color: '#9B9B9B'
  }
})
