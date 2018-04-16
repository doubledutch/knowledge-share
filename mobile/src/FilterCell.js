'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Color } from '@doubledutch/rn-client'

export default class FilterCell extends Component {
  render() {
    const { item, select, state } = this.props 

    if (state) return (
      <TouchableOpacity style={s.buttonContainerMargin}>
        <Text style={s.title}>{item}</Text>
      </TouchableOpacity>
    )

    if (select) return (
      <TouchableOpacity onPress={ () => this.props.removeFilter(item) } style={s.buttonContainerColor}>
        <Text style={s.titleColor}>{item.title}</Text>
      </TouchableOpacity>
    )
    else return (
      <TouchableOpacity onPress={ () => this.props.addFilter(item)} style={s.buttonContainer}>
        <Text style={s.title}>{item.title}</Text>
      </TouchableOpacity>
    )
  }






}

function hexToRgb(hex) {
  var hex = hex.slice(1)
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return r + "," + g + "," + b;
}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  buttonContainer: {
    height: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 25,
    backgroundColor: 'rgba('+ hexToRgb(client.primaryColor) + ',0.1)',
  },
  buttonContainerMargin: {
    height: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginVertical: 5,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: 'rgba('+ hexToRgb(client.primaryColor) + ',0.1)',
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: client.primaryColor
  },
  buttonContainerColor: {
    backgroundColor: client.primaryColor,
    height: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 25,
  },
  titleColor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white"
  }

  
})