'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'

export default class TableHeader extends Component {

  renderPrompt = (questions) => {
    const filteredQuestions = Object.values(questions).filter(item => item.block === false) || []
    if (filteredQuestions.length === 0) {
      return (
        <View style={{marginTop: 96}}>
          <Text style={{marginTop: 30, textAlign: "center", fontSize: 20, color: '#9B9B9B', marginBottom: 5, height: 25}}>Get the Conversation Started!</Text>
          <TouchableOpacity style={{marginTop: 5, height: 25}} onPress={this.props.showModal}><Text style={{textAlign: "center", fontSize: 18, color: client.primaryColor}}>Tap here to get started</Text></TouchableOpacity>
        </View>
      )
    }
  }

  render() { 
    const questions = this.props.questions
      return (
        <View>
          <View style={{height: 50, marginTop: 10, marginBottom: 1}}>
            <View style={s.buttonContainer}>
              <TouchableOpacity style={s.button2} onPress={() => this.props.handleChange("showSort", true)}><Text style={s.dashboardButton}>{"Sort: " + this.props.currentSort}</Text></TouchableOpacity>
              <View style={{flex: 1}}/>
              <TouchableOpacity style={s.button3} disabled={!questions} onPress={this.getFilters}><Text style={s.dashboardButton}>{"Topics: " + this.props.selectedFilters.length}</Text></TouchableOpacity>
            </View>
          </View>
          {this.renderPrompt(questions)}
        </View>
      )
  }

  getFilters = () => {
    this.props.handleChange("showFilters", true)
    this.props.organizeFilters()
  }

}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "white",
  },
  button2: {
    height: 40,
    paddingTop: 10,
    marginBottom: 10,
    marginLeft: 40,
    justifyContent: 'center',
  },
  button3: {
    height: 40,
    paddingTop: 10,
    marginBottom: 10,
    marginRight: 40,
    justifyContent: 'center',
  },
  dividerSm: {
    width: 30
  },
  dashboardButton: {
    fontSize: 18,
    color: client.primaryColor
  }
})