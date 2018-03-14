'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'


export class MyList extends Component {
    constructor(props){
        super(props)
        this.newVotes = this.newVotes.bind(this)
        this.state = {
          anom: false,
          showMessage: false
        }
    }

  render() { 
    let newQuestions = this.props.questions
    return (
      <View>
        {this.renderHeader(newQuestions)}
        <FlatList
        data={newQuestions}
        ListFooterComponent={<View style={{height: 100}}></View>}
        renderItem={({item}) => {
          return(
            <View style={s.listContainer}>
              <View style={s.leftContainer}>
                {this.renderIcon(item)}
                <Text style={s.subText}>{item.score}</Text>
              </View>
              <View style={s.rightContainer}>
                <Text style={s.questionText}>{item.text}</Text>
                <Text style={s.nameText}>
                  -{item.creator.firstName} {item.creator.lastName}
                </Text>
              </View>
            </View>
          )
        }}
      />
    </View>
  )
  }

  renderHeader = (questions) => {
    if (questions.length === 0) {
      return (
        <View>
          <View style={{height:60}}>
            <View style={s.buttonContainer}>
              <View style={s.divider}/>
              <TouchableOpacity style={s.button1}><Text style={s.dashboardButton}>Popular</Text></TouchableOpacity>
              <View style={s.dividerSm}/>
              <TouchableOpacity style={s.button2} onPress={this.props.findOrderDate}><Text style={s.dashboardButton}>Recent</Text></TouchableOpacity>
              <View style={s.divider}/>
            </View>
          </View>
          <View style={{marginTop: 96}}b>
            <Text style={{marginTop: 30, textAlign: "center", fontSize: 20, color: '#9B9B9B', marginBottom: 5, height: 25}}>Be the First to Ask a Question!</Text>
            <TouchableOpacity style={{marginTop: 5, height: 25}} onPress={this.props.showModal}><Text style={{textAlign: "center", fontSize: 18, color: client.primaryColor}}>Tap here to get started</Text></TouchableOpacity>
          </View>
        </View>
      )
    }

    else {

    if (this.props.showRecent === false) {
      return (
      <View style={{height: 60}}>
        <View style={s.buttonContainer}>
          <View style={s.divider}/>
          <TouchableOpacity style={s.button1} ><Text style={s.dashboardButton}>Popular</Text></TouchableOpacity>
          <View style={s.dividerSm}/>
          <TouchableOpacity style={s.button2} onPress={this.props.findOrderDate}><Text style={s.dashboardButton}>Recent</Text></TouchableOpacity>
          <View style={s.divider}/>
        </View>
      </View>
      )
    }
    if (this.props.showRecent === true) {
      return (
      <View style={{height: 60}}>
        <View style={s.buttonContainer}>
          <View style={s.divider}/>
          <TouchableOpacity style={s.button2} onPress={this.props.findOrder}><Text style={s.dashboardButton}>Popular</Text></TouchableOpacity>
          <View style={s.dividerSm}/>
          <TouchableOpacity style={s.button1}><Text style={s.dashboardButton}>Recent</Text></TouchableOpacity>
          <View style={s.divider}/>
        </View>
      </View>
      )
    }
  }
  }

  renderIcon = (question) => {
    if (question.myVote === true){
      return <TouchableOpacity onPress={() => this.newVotes(question)}><Image style={s.checkmark} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/question-and-answer/Active.png"}}/></TouchableOpacity>
    }
    else {
       return <TouchableOpacity onPress={() => this.newVotes(question)}><Image style={s.checkmark} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/question-and-answer/Inactive.png"}}/></TouchableOpacity>
    }
  }

  newVotes(question){
    this.props.newVote(question)
  }

}

export default MyList

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  subText:{
    fontSize: 12,
    color: '#9B9B9B'
  },
  nameText:{
    fontSize: 14,
    color: '#9B9B9B',
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
  questionText:{
    fontSize: 16,
    color: '#364247',
    fontFamily: 'System',
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: 'white',
    marginBottom: 2,
  },
  leftContainer: {
    flexDirection: 'column',
    paddingLeft: 10,
    backgroundColor: 'white',
    alignItems:'center',
    height: '100%',
    paddingTop: 15
  },
  rightContainer: {
    flex: 1,
    width: '80%',
    paddingLeft: 15,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  checkmark: {
    height: 16,
    width: 16,
    marginTop: 4
  },
  compose: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  dashboardButton: {
    fontSize: 18,
    color: '#9B9B9B'
  }
})
