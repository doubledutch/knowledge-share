'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'

export default class TableCell extends Component {
  render() {
    const { item } = this.props 
    return (
      <View>
        {this.renderCell(item)}
      </View>
    )
  }

  renderCell = (item) => {
    if (this.props.showQuestion) {
      return (
        <TouchableOpacity style={s.listContainer} onPress={() => this.props.showComments(item)}>
          <View style={s.leftContainer}>
            {/* {this.renderIcon(item)} */}
            <Text style={s.subText}>Votes</Text>
            <Text style={s.subText}>{item.score}</Text>
          </View>
          <View style={s.rightContainer}>
            <Text style={s.questionText}>{item.text}</Text>
            <View style={s.buttonContainer}>
              <Avatar user={item.creator} size={20} style={{marginRight: 8, marginLeft: 5}} />
              <Text style={s.nameText}>{item.creator.firstName} {item.creator.lastName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    }
    else {
      return (
        <View style={s.listContainer}>
          <View style={s.leftContainer}>
            {this.renderIcon(item)}
            <Text style={s.subText}>{item.score}</Text>
          </View>
          <View style={s.rightContainer}>
            <Text style={s.questionText}>{item.text}</Text>
            <View style={s.buttonContainer}>
              <Avatar user={item.creator} size={20} style={{marginRight: 8, marginLeft: 5}} />
              <Text style={s.nameText}>{item.creator.firstName} {item.creator.lastName}</Text>
            </View>
          </View>
        </View>
      )
    }
  }

  renderIcon = (question) => {
    if (question.myVote === true){
      return <TouchableOpacity onPress={() => this.props.newVotes(question)}><Image style={s.checkmark} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/question-and-answer/Active.png"}}/></TouchableOpacity>
    }
    else {
       return <TouchableOpacity onPress={() => this.props.newVotes(question)}><Image style={s.checkmark} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/question-and-answer/Inactive.png"}}/></TouchableOpacity>
    }
  }

}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2
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
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: 'white',
    marginBottom: 2,
    minHeight: 60,
  },
  leftContainer: {
    flexDirection: 'column',
    paddingLeft: 10,
    alignItems:'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 10
  },
  rightContainer: {
    flex: 1,
    width: '80%',
    paddingLeft: 15,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  checkmark: {
    height: 16,
    width: 16,
    marginTop: 4
  },
})