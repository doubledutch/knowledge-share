'use strict'
import React, { Component } from 'react'
import ReactNative, {
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Image, Modal
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
import MyList  from './Table'
import CustomModal from './Modal'
import HomeHeader from './HomeHeader'
import FilterSelect from './FilterSelect'
import SortSelect from './SortSelect'
import ReportModal from './ReportModal'

import {
  mapPerUserPushedDataToStateObjects,
  mapPerUserPushedDataToObjectOfStateObjects,
  reducePerUserDataToStateCount,
} from './firebaseHelpers'

const fbc = FirebaseConnector(client, 'knowledgeshare')
fbc.initializeAppWithSimpleBackend()

class HomeView extends Component {
  constructor() {
    super()
    this.state = {
      question: '',
      report: '',
      disable: false, 
      questions: {},
      answersByQuestion: {},
      votesByQuestion: {},
      votesByAnswer: {},
      filters: [],
      selectedFilters: [],
      showRecent: false, 
      showError: "white", 
      modalVisible: false, 
      animation: "none",
      title: "Knowledge Share",
      questionError: "Ask Question",
      topBorder: "#EFEFEF",
      showQuestion:true,
      showFilters: false,
      showSort: false,
      currentSort: "Most Popular",
      showReportModal: false
    }
    this.signin = fbc.signin()
      .then(user => this.user = user)

    this.signin.catch(err => console.error(err))
  }

  componentDidMount(){
    this.signin.then(() => {
      mapPerUserPushedDataToStateObjects(fbc, 'questions', this, 'questions', (userId, key, value) => key)
      mapPerUserPushedDataToObjectOfStateObjects(fbc, 'answers', this, 'answersByQuestion', (userId, key, value) => value.questionId, (userId, key, value) => key)
      reducePerUserDataToStateCount(fbc, 'questionVotes', this, 'votesByQuestion', (userId, key, value) => key)
      reducePerUserDataToStateCount(fbc, 'answerVotes', this, 'votesByAnswer', (userId, key, value) => key)

    })
  }

  render() {
    return (
      <KeyboardAvoidingView style={s.container} behavior={Platform.select({ios: "padding", android: null})}>
        <TitleBar title={this.state.title} client={client} signin={this.signin} />
        {this.modalControl()}
        {this.renderHome()}
        {this.renderFooter()}
      </KeyboardAvoidingView> 
    )
  }

  modalControl = () => {
    return (
    <Modal
      animationType="none"
      transparent={true}
      visible={this.state.showReportModal}
      onRequestClose={() => {
        alert('Modal has been closed.');
      }}
      >
      <ReportModal handleChange={this.handleChange} reportQuestion={this.reportQuestion} report={this.state.report}/>
    </Modal>
    )
  }

  organizeFilters = () => {
    var filters = []
    Object.values(this.state.questions).map((item) => {
      if (item.filters) {
        item.filters.map((filter) => {
          filters.push(filter)
        })
      }
    })
    filters.sort()
    this.countFilters(filters)
  }

  addFilter = (selected) => {
    var filters = this.state.filters
    var index = filters.indexOf(selected)
    var filter = filters.splice(index, 1)
    const selectedFilters = this.state.selectedFilters.concat(filter)
    this.setState({filters, selectedFilters})
  }

  removeFilter = (selected) => {
    var selectedFilters = this.state.selectedFilters
    var index = selectedFilters.indexOf(selected)
    var filter = selectedFilters.splice(index, 1)
    const filters = this.state.filters.concat(filter)
    this.setState({filters, selectedFilters})
  }

  countFilters = (filters) => {
    var newFilters = []
    var current = null;
    var cnt = 0;
    for (var i = 0; i < filters.length; i++) {
        if (filters[i] != current) {
            if (cnt > 0) {
              var filter = {title: current, count:cnt}
              newFilters.push(filter)
            }
            current = filters[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
      var filter = {title: current, count:cnt}
      newFilters.push(filter)
    }
    this.setState({filters: newFilters})
  }

  renderHome = () => {
    if (this.state.showFilters) {
      return(
        <View style={{flex:1}}>
          <FilterSelect handleChange={this.handleChange} filters={this.state.filters} selectedFilters={this.state.selectedFilters} addFilter={this.addFilter} removeFilter={this.removeFilter}/>
        </View>
      )
    }
    if (this.state.showSort) {
      return(
        <View style={{flex:1}}>
          <SortSelect handleChange={this.handleChange} sortTopics={this.sortTopics} currentSort={this.state.currentSort}/>
        </View>
      )
    }

    if (this.state.modalVisible === false) {
      return(
      <View style={{flex:1}}>
        <HomeHeader
          showModal={this.showModal}
          showQuestion={this.state.showQuestion}
          question={this.state.question}
          showFilters={this.state.showFilters}
          votesByQuestion = {this.state.votesByQuestion}
          reportQuestion={this.reportQuestion}
          newVote={this.newVote}
          handleChange={this.handleChange}
          handleReport={this.handleReport}
        />
        <View style={{flex:1}}>
          <MyList 
            questions={this.state.questions}
            question={this.state.question}
            votesByQuestion = {this.state.votesByQuestion}
            showModal = {this.showModal}
            newVote = {this.newVote}
            showQuestion ={this.state.showQuestion}
            handleChange={this.handleChange}
            showComments={this.showComments}
            comments = {this.state.answersByQuestion}
            votesByAnswer = {this.state.votesByAnswer}
            organizeFilters={this.organizeFilters}
            currentSort={this.state.currentSort}
            selectedFilters={this.state.selectedFilters}
            reportQuestion={this.reportQuestion}
            handleReport={this.handleReport}
          />
        </View>
      </View>
      )
    } 
    else {
      return(
        <CustomModal 
          showModal = {this.showModal}
          makeTrue = {this.makeTrue}
          createSharedQuestion = {this.createSharedQuestion}
          createSharedComment = {this.createSharedComment}
          disable = {this.state.disable}
          question = {this.state.question}
          showError = {this.state.showError}
          hideModal = {this.hideModal}
          modalVisible = {this.state.modalVisible}
          questionError = {this.state.questionError}
          style={{flex:1}}
          showQuestion={this.state.showQuestion}
          filters={this.state.filters}
          organizeFilters={this.organizeFilters}
          votesByAnswer={this.state.votesByAnswer}
          votesByQuestion={this.state.votesByQuestion}
        />
      )
    }
  }

  renderFooter = () => {
    if (this.state.showQuestion === false && this.state.modalVisible === false) {
      return (
        <TouchableOpacity onPress={() => this.handleChange("showQuestion", true)} style={s.back}></TouchableOpacity>
      )
    }
  }


  showModal = () => {
    this.setState({modalVisible: true, animation: "none"})

    //move to the listener
    this.organizeFilters()
  }

  hideModal = () => {
    this.setState({modalVisible: false, animation: "slide", showError: "white"})
  }

  handleReport = (item) => {
    this.setState({showReportModal: true, report: item})
  }

  


  reportQuestion = (question) => this.createReport(fbc.database.private.adminableUserRef, question)

  createReport = (ref, question) => {
    var time = new Date().getTime()
    ref('reportQuestions').child(question.id).push({
      reportTime: time,
      user: client.currentUser
    })
    .then(() => {
      this.setState({showReportModal: false})
    })
  }

  sortTopics = (currentSort) => {
    this.setState({currentSort, showSort: false})
  }

  showComments = (question) => {
    this.handleChange("question", question)
    this.handleChange("showQuestion", false)
  }

  handleChange = (prop, value) => {
    this.setState({[prop]: value})
  }

  createSharedQuestion = (question, filters) => this.createQuestion(fbc.database.public.userRef, question, filters)

  createQuestion = (ref, question, filters) => {
    var time = new Date().getTime()
    var questionName = question.trim()
    if (questionName.length === 0) {
      this.setState({showError: "red"})
    }
    if (this.user && questionName.length > 0) {
      ref('questions').push({
        text: questionName,
        creator: client.currentUser,
        comments: [],
        dateCreate: time,
        block: false,
        lastEdit: time,
        filters: filters
      })
      .then(() => {
        this.setState({question: '', showError: "white"})
        setTimeout(() => {
          this.hideModal()
          }
          ,250)
      })
      .catch(error => this.setState({questionError: "Retry"}))
    }
  }

    
  createSharedComment = (comment) => this.createComment(fbc.database.public.userRef, comment)

  createComment = (ref, comment) => {
    var time = new Date().getTime()
    var commentName = comment.trim()
    if (commentName.length === 0) {
      this.setState({showError: "red"})
    }
    if (this.user && commentName.length > 0) {
      ref('answers').push({
        text: commentName,
        creator: client.currentUser,
        dateCreate: time,
        block: false,
        lastEdit: time,
        questionId: this.state.question.id
      })
      .then(() => {
        this.setState({showError: "white"})
        setTimeout(() => {
          this.hideModal()
          }
          ,250)
      })
      .catch(error => this.setState({questionError: "Retry"}))
    }
  }

  newVote = (c) => {
      if (c.questionId) {
        fbc.database.public.userRef('answerVotes').child(c.id).set(true)
      }
      else { 
        fbc.database.public.userRef('questionVotes').child(c.id).set(true)
      }
    // }
  }
}

export default HomeView

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  back: {
    height: 75,
    backgroundColor: 'black',
    opacity: 0.5,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF'
  },
  textBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  checkmark: {
    height: 16,
    width: 16,
    marginTop: 4
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
