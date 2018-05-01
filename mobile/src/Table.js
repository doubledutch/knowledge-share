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
    const { newVote, showQuestion, showComments, handleReport, handleChange } = this.props
    const data = this.verifyData()
    return (
      <View>
        {this.renderHeader(showQuestion)}
        <FlatList
          data={data}
          ListFooterComponent={<View style={{height: 100}}></View>}
          renderItem={({item}) => {
            const isReported = this.isReported(item)
            return (
              <TableCell item={item} commentsTotal={this.totalComments(item.id)} newVote={newVote} votesByAnswer={this.props.votesByAnswer} votesByQuestion={this.props.votesByQuestion} showQuestion={showQuestion} showComments={showComments} handleReport={handleReport} isReported={isReported}/>
            )
          }}
        />
      </View>
    )
  }

  isReported = (item) => {
    const { reports } = this.props
    if (item.questionId) {
      return (
        ((reports && reports.find(q => q === item.id)) ? true : false)
      )
    }
    else {
      return (
        ((reports && reports.find(q => q === item.id)) ? true : false)
      )
    }
  }

  verifyData = () => {
    var questions = Object.values(this.props.questions)
    if (this.props.showQuestion) {
      questions = questions.filter(question => question.block === false)
      return this.originalOrder(questions)
    }
    else {
      if (this.props.comments) {    
        const comments = this.props.comments[this.props.question.id]
        if (comments) {
          return this.commentsOrder(comments)
        }
        else {
          return []
        }
      }
      else {
        return []
      }
    }
  }

  totalComments = (key) => {
    var total = 0
    var comments = this.props.comments[key]
    if (comments) {
      comments = Object.values(comments)
      comments = comments.filter(item => item.block === false)
      total = comments.length
    }
    return total
  }

  commentsOrder = (comments) => {
    const votes = this.props.votesByAnswer || 0
    var sortComments = Object.values(comments)
    sortComments = sortComments.filter(comment => comment.block === false )
    this.dateSort(sortComments)
    sortComments.sort(function (a,b){
      const voteCount = ((votes[a.id] || 0) ? votes[a.id] : 0 )
      const voteCount2 = ((votes[b.id] || 0) ? votes[b.id] : 0 )
      return voteCount2 - voteCount
    })
    return sortComments
  }

  originalOrder = (questions) => {
    const {currentSort, selectedFilters} = this.props
    const votes = this.props.votesByQuestion || 0
    if (questions) {
      if (currentSort === 'My Questions') {
        return questions.filter((item) => item.creator.id === client.currentUser.id)
      } else {
        if (currentSort === "Most Popular") {
          this.dateSort(questions)
            questions.sort(function (a,b){
              const voteCount = ((votes[a.id] || 0) ? votes[a.id] : 0 )
              const voteCount2 = ((votes[b.id] || 0) ? votes[b.id] : 0 )
              return voteCount2 - voteCount
            })
        }
        else if (currentSort === "Most Recent") {
          this.dateSort(questions)
        }

        if (selectedFilters.length > 0) {
          const searchFilters = selectedFilters.map(f => f.title)
          questions = questions.filter(q => q.filters && q.filters.some(f => searchFilters.includes(f)))
        }

        return questions
      }
    }
    else {
      return []
    }
  }

  dateSort = (questions) => {
    questions.sort(function (a,b){
      return b.dateCreate - a.dateCreate
    })
  }

 

  renderHeader = (showQuestion) => {
    if (showQuestion){
      return (
        <TableHeader 
          questions={this.props.questions} 
          showRecent={this.props.showRecent}
          showModal={this.props.showModal}
          handleChange={this.props.handleChange}
          organizeFilters={this.props.organizeFilters}
          currentSort={this.props.currentSort}
          selectedFilters={this.props.selectedFilters}
        />
      )
    } 
  }

}

export default MyList

const fontSize = 18
const s = ReactNative.StyleSheet.create({

})
