'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'

export default class TableHeader extends Component {

  renderPrompt = (questions) => {
    var questions = Object.values(questions)
    if (this.props.currentSort === "My Questions") {
      questions = questions.filter((item) => item.creator.id === client.currentUser.id
    )}
    const filteredQuestions = questions.filter(item => item.block === false) || []
    if (filteredQuestions.length === 0) {
      return (
        <View style={{marginTop: 96}}>
          <Text style={{marginTop: 30, textAlign: "center", fontSize: 20, color: '#9B9B9B', marginBottom: 5, height: 25}}>
            {(this.props.currentSort === "My Questions") ? "You Haven't Asked a Question Yet" : "Get the Conversation Started!"}
          </Text>
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
              <TouchableOpacity style={s.button2} onPress={() => this.props.handleChange("showSort", true)}><Text style={s.dashboardButtonTitle}>Sort: </Text><Text style={s.dashboardButton}>{this.props.currentSort}</Text></TouchableOpacity>
              <TouchableOpacity style={s.button3} disabled={!questions} onPress={this.getFilters}><Text style={s.dashboardButtonTitle}>Filter: </Text><Text style={s.dashboardButton}>{this.props.selectedFilters.length} Topics</Text></TouchableOpacity>
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
    justifyContent: "center"
  },
  button2: {
    justifyContent: 'center',
    alignItems: "center",
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  button3: {
    justifyContent: 'center',
    alignItems: "center",
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  dividerSm: {
    width: 30
  },
  dashboardButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: client.primaryColor
  },
  dashboardButtonTitle: {
    fontSize: 16,
    color: '#9B9B9B'
  }
})