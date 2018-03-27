'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'

export default class TableHeader extends Component {

  renderPrompt = (questions) => {
    if (questions === 0) {
      return (
        <View style={{marginTop: 96}}>
          <Text style={{marginTop: 30, textAlign: "center", fontSize: 20, color: '#9B9B9B', marginBottom: 5, height: 25}}>Be the First to Ask a Question!</Text>
          <TouchableOpacity style={{marginTop: 5, height: 25}} onPress={this.props.showModal}><Text style={{textAlign: "center", fontSize: 18, color: client.primaryColor}}>Tap here to get started</Text></TouchableOpacity>
        </View>

      )
    }
  }

  render() { 
    const questions = this.props.questions
    if (this.props.showRecent === false) {
      return (
      <View>
        <View style={{height: 60}}>
          <View style={s.buttonContainer}>
            <View style={s.divider}/>
            <TouchableOpacity style={s.button1} ><Text style={s.dashboardButton}>Popular</Text></TouchableOpacity>
            <View style={s.dividerSm}/>
            <TouchableOpacity style={s.button2} onPress={() => this.props.handleChange("showRecent", true)}><Text style={s.dashboardButton}>Recent</Text></TouchableOpacity>
            <View style={s.divider}/>
            <TouchableOpacity style={s.button2} onPress={() => this.props.handleChange("showFilters", true)}><Text style={s.dashboardButton}>Filters</Text></TouchableOpacity>
          </View>
        </View>
        {this.renderPrompt(questions)}
      </View>
      )
    }
    if (this.props.showRecent === true) {
      return (
      <View>
        <View style={{height: 60}}>
          <View style={s.buttonContainer}>
            <View style={s.divider}/>
            <TouchableOpacity style={s.button2} onPress={() => this.props.handleChange("showRecent", false)}><Text style={s.dashboardButton}>Popular</Text></TouchableOpacity>
            <View style={s.dividerSm}/>
            <TouchableOpacity style={s.button1}><Text style={s.dashboardButton}>Recent</Text></TouchableOpacity>
            <View style={s.divider}/>
          </View>
        </View>
        {this.renderPrompt(questions)}
      </View>
      )
    }
  }

  // handleChange = (prop, value) => {
  //   this.props.handleChange(prop, value)
  // }

}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
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