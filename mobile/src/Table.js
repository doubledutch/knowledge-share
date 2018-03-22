'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'
import TableHeader from './TableHeader'
import TableCell from './TableCell'


export class MyList extends Component {

  render() { 
    const { questions, newVote, showQuestion, showComments } = this.props
    const data = this.verifyData()
    return (
      <View>
        {this.renderHeader(showQuestion)}
        <FlatList
          data={data}
          ListFooterComponent={<View style={{height: 100}}></View>}
          renderItem={({item}) => {
            return (
              <TableCell item={item} commentsTotal={this.totalComments(item.key)} newVotes={newVote} votes={this.props.votes} showQuestion={showQuestion} showComments={showComments}/>
            )
          }}
        />
      </View>
    )
  }

  verifyData = () => {
    if (this.props.showQuestion) {
      return this.props.questions
    }
    else {
      const comments = this.props.comments[this.props.question.key]
      return comments
    }
  }

  totalComments = (key) => {
    var total = 0
    var comments = this.props.comments[key]
    if (comments) {
      total = comments.length
    }
    return total
  }

 

  renderHeader = (showQuestion) => {
    if (showQuestion){
      return (
        <TableHeader 
          questions={this.props.questions} 
          showRecent={this.props.showRecent}
          showModal={this.props.showModal}
          handleChange={this.props.handleChange}
        />
      )
    } 
  }

}

export default MyList

const fontSize = 18
const s = ReactNative.StyleSheet.create({

})
