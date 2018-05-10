'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Color } from '@doubledutch/rn-client'

export default class FilterCell extends Component {
  render() {
    const { item, isReported, handleReport } = this.props 
    if (item.creator.id !== client.currentUser.id){
      return (
        <TouchableOpacity style={s.buttonContainer} onPress={() => handleReport(item)}>
          <Text style={s.title}>{isReported ? "Reported" : "Report"}</Text>
        </TouchableOpacity>
      )
    }
    else return null
  }
}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  buttonContainer: {
    height: 20,
    backgroundColor: "white"
  },
  title : {
    fontSize: 14,
    color: '#9B9B9B'
  }
  
})