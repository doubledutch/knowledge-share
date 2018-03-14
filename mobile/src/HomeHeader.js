'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'
import TableCell from './TableCell'

export default class HomeHeader extends Component {

  render() {
    const newStyle = {
      flex: 1,
      marginBottom: 20,
      fontSize: 18,
      color: '#9B9B9B',
      maxHeight: 100,
      height: 22,
      marginTop: 20,
      paddingTop: 0,
    }
    const androidStyle = {
      paddingLeft: 0,
      paddingBottom: 0,
      textAlignVertical: 'center'
    } 
    const questions = this.props.questions
    
    if (this.props.showQuestion) {
      return (
        <View style={s.textBox}>
          <TouchableOpacity style={s.circleBox} onPress={this.props.showModal}><Text style={s.whiteText}>?</Text></TouchableOpacity>
          <TextInput  underlineColorAndroid='transparent' style={Platform.select({ios: newStyle, android: [newStyle, androidStyle]})} placeholder="Type your question here"
            autoFocus={false}
            onFocus={this.props.showModal}
            multiline={true}
            placeholderTextColor="#9B9B9B"
          />
        </View>
      )
    }
    else {
      return (
        <View style={s.box}>
          {this.renderQuestion(this.props.question)}
          <View style={s.textBox}>
            <TouchableOpacity style={s.circleBox} onPress={this.props.showModal}><Text style={s.whiteText}>?</Text></TouchableOpacity>
            <TextInput  underlineColorAndroid='transparent' style={Platform.select({ios: newStyle, android: [newStyle, androidStyle]})} placeholder="Add your own answer"
              autoFocus={false}
              onFocus={this.props.showModal}
              multiline={true}
              placeholderTextColor="#9B9B9B"
            />
          </View>
        </View>
      )
    }
  }

  renderQuestion = (question) => {
    return (
      <View style={s.listContainer}>
        <View style={s.rightContainer}>
          <Text style={s.questionText}>{question.text}</Text>
          <View style={s.buttonContainer}>
            <Avatar user={question.creator} size={20} style={{marginRight: 8, marginLeft: 5}} />
            <Text style={s.nameText}>{question.creator.firstName} {question.creator.lastName}</Text>
          </View>
        </View>
    </View>
    )

  }


}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
  },
  subText:{
    fontSize: 12,
    color: '#9B9B9B'
  },
  nameText:{
    fontSize: 14,
    color: '#9B9B9B',
  },
  questionText:{
    fontSize: 16,
    color: '#364247',
    fontFamily: 'System',
    marginBottom: 5
  },
  listContainer: {
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: 'white',
    marginBottom: 1,
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 5,
  },
  checkmark: {
    height: 16,
    width: 16,
    marginTop: 4
  },
  box: {
    marginBottom: 25
  },
  textBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  circleBox: {
    marginTop:20,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: '#9B9B9B',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    height: 22,
    borderRadius: 50,
  },
  whiteText: {
    fontSize: 18,
    color: 'white',
  }
})