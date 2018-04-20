'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'
import FilterCell from './FilterCell'
import ReportButton from './ReportButton'

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
    const voteCount = item.questionId
      ? (this.props.votesByAnswer[item.id] || 0)
      : (this.props.votesByQuestion[item.id] || 0)

    if (this.props.showQuestion) {
      return (
        <TouchableOpacity style={s.listContainer} onPress={() => this.props.showComments(item)}>
          <View style={s.rightContainer}>
            <Text style={s.boldText}>{item.text}</Text>
            <View style={s.buttonContainer}>
              <Avatar user={item.creator} size={20} style={{marginRight: 8, marginLeft: 5}} />
              <Text style={s.nameText}>{item.creator.firstName} {item.creator.lastName}</Text>
              <View style={{flex:1}}></View>
              <Text style={s.voteText}>{voteCount + " Votes"}</Text>
              <Text style={s.subText}>{this.props.commentsTotal + " Answer" + ((this.props.commentsTotal === 1) ? "": "s")}</Text>
            </View>
            {this.renderFilters(item)}
          </View>
        </TouchableOpacity>
      )
    }
    else {
      return (
        <View style={s.listContainer}>
          <View style={s.rightContainer}>
            <Text style={s.questionText}>{item.text}</Text>
            <View style={s.buttonContainer}>
              <Avatar user={item.creator} size={20} style={{marginRight: 8, marginLeft: 5}} />
              <Text style={s.nameText}>{item.creator.firstName} {item.creator.lastName}</Text>
            </View>
            <View style={s.voteContainer}>
              <TouchableOpacity style={s.upVoteButton} onPress={()=> this.props.newVote(item)}><Text style={s.upVoteText}>{"Upvote | " + voteCount}</Text></TouchableOpacity>
              <View style={{flex:1}}></View>
              <ReportButton report={this.props.reportQuestion} item={item} handleReport={this.props.handleReport} isReported={this.props.isReported}/> 
            </View>
          </View>
        </View>
      )
    }
  }

  renderFilters = (item) => {
    var filters = []
    if (item.filters) filters = item.filters
      return (
        <View style={s.table2}>
          { filters.map((item, i) => {
            return (
            <FilterCell item={item} key={i} state={true}/>
            )
          }) }
        </View>
      )
  }


  renderIcon = (item) => {
    return <TouchableOpacity onPress={() => this.props.newVotes(item)}><Image style={s.checkmark} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/question-and-answer/Inactive.png"}}/></TouchableOpacity>
  }
}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
  },
  voteContainer: {
    height: 40, 
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center'
  },
  upVoteButton: {
    backgroundColor: client.primaryColor, 
    alignContent:'center', 
    height: 30,
    paddingHorizontal: 10, 
    margin: 10,
    marginLeft: 0,
    justifyContent: "center",
    borderRadius: 5
  },
  table2: {
    flexDirection: "row",
    backgroundColor: "white",
    flexWrap: "wrap"
  },
  subText:{
    fontSize: 14,
    color: '#9B9B9B'
  },
  voteText:{
    fontSize: 14,
    marginRight: 5,
    color: '#9B9B9B'
  },
  upVoteText: {
    color: 'white'
  },
  nameText:{
    fontSize: 14,
    color: '#9B9B9B',
  },
  questionText:{
    fontSize: 16,
    color: "#404040",
    fontFamily: 'System',
    marginBottom: 5
  },
  boldText:{
    fontSize: 16,
    fontWeight: "bold",
    color: "#404040",
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
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  leftContainer: {
    flexDirection: 'column',
    paddingLeft: 10,
    alignItems:'center',
    justifyContent: 'center',
    height: '100%',
 
  },
  rightContainer: {
    flex: 1,
    width: '80%',
    paddingLeft: 15,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
  },
  checkmark: {
    height: 16,
    width: 16,
    marginTop: 4
  },
})