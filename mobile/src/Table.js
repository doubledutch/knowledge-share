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
    const { questions, newVote, showQuestion, showComments }= this.props
    const data = this.verifyData()
    return (
      <View>
        {this.renderHeader(showQuestion)}
        <FlatList
          data={data}
          ListFooterComponent={<View style={{height: 100}}></View>}
          renderItem={({item}) => {
            return (
              <TableCell item={item} newVotes={newVote} votes={this.props.votes} showQuestion={showQuestion} showComments={showComments}/>
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
      // console.log(this.props.question.comments)
      // var comments = this.props.question.comments

      const comments = this.props.comments[this.props.question.key]
      // comments.pop()
      // this.props.question.commments.map(comment => {
      //   for (var i in this.props.question.comments) {
      //   if (this.props.) {
      //     comments.push(comment)
      //   }
      // }
      // })
    
      return comments
    }
  }

 

  renderHeader = (showQuestion) => {
    if (showQuestion){
      return (
        <TableHeader 
          questions={this.props.questions} 
          // findOrderDate={this.props.findOrderDate} 
          // findOrder={this.props.findOrder} 
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
