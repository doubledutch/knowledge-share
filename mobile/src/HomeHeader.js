'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import { pencil } from './images'
import client, { Avatar, TitleBar, Color, translate as t } from '@doubledutch/rn-client'
import TableCell from './TableCell'
import FilterCell from './FilterCell'
import ReportButton from './ReportButton'

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
          <TextInput  underlineColorAndroid='transparent' style={Platform.select({ios: newStyle, android: [newStyle, androidStyle]})} placeholder={t("what_question")}
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
            <Image style={s.pencilBox} source={pencil}/>
            <TextInput  underlineColorAndroid='transparent' style={Platform.select({ios: newStyle, android: [newStyle, androidStyle]})} placeholder={t("add_answer")}
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
    const reports = this.props.reports
    const isReported = ((reports && reports.find(q => q === question.id)) ? true : false)
    return (
      <View style={{flexDirection: 'column'}}>
        <View style={s.listContainer}>
          <View style={s.rightContainer}>
            <Text style={s.boldText}>{question.text}</Text>
            <View style={s.buttonContainer}>
              <Avatar user={question.creator} size={20} style={{marginRight: 8, marginLeft: 5}} />
              <Text numberOfLines={2} style={s.nameText}>{question.creator.firstName} {question.creator.lastName}</Text>
              <View style={{flex: 1}}/>
              <ReportButton report={this.props.reportQuestion} item={question} handleReport={this.props.handleReport} isReported={isReported}/>
            </View>
          </View>
        </View>
        <View style={s.filterContainer}>
          <TouchableOpacity style={s.upVoteButton} onPress={()=> this.props.newVote(question)}><Text style={s.voteText}>{ t("upvote") + " | " + ((this.props.votesByQuestion[question.id]) ? this.props.votesByQuestion[question.id] : 0 )}</Text></TouchableOpacity>
          {this.renderFilters(question)}
        </View>
      </View>
    )
  }

  renderFilters = (item) => {
    var filters = []
    if (item.filters) filters = item.filters
      return (
        <View style={s.filterTable}>
          { filters.map((item, i) => {
            return (
              <FilterCell item={item} key={i} state={true}/>
            )
          }) }
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTable: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    marginLeft: 10,
    alignItems: 'center',
    alignContent: 'center',
    flexWrap: 'wrap'
  },
  upVoteButton: {
    backgroundColor: client.primaryColor, 
    alignContent:'center', 
    height: 30,
    paddingHorizontal: 10, 
    margin: 10,
    justifyContent: "center",
    borderRadius: 5
  },
  voteText: {
    color: 'white'
  },
  subText:{
    fontSize: 12,
    color: '#9B9B9B'
  },
  nameText:{
    fontSize: 14,
    color: '#9B9B9B',
    width: 100
  },
  questionText:{
    fontSize: 16,
    color: '#364247',
    fontFamily: 'System',
    marginBottom: 5
  },
  boldText: {
    fontSize: 16,
    color: "#404040",
    fontFamily: 'System',
    marginBottom: 5,
    fontWeight: "bold"
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
  pencilBox: {
    marginTop:22,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: 15,
    height: 15,
  },
  whiteText: {
    fontSize: 18,
    color: 'white',
  }
})