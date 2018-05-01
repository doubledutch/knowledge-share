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
  mapPerUserPublicPushedDataToStateObjects,
  mapPerUserPublicPushedDataToObjectOfStateObjects,
  reducePerUserPublicDataToStateCount,
  mapPushedDataToStateObjects
} from '@doubledutch/firebase-connector'

const fbc = FirebaseConnector(client, 'knowledgeshare')
fbc.initializeAppWithSimpleBackend()

const topSpaceHeight = 21
const barHeight = 43

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
      myVotesByQuestion: {},
      myVotesByAnswer: {},
      filters: [],
      selectedFilters: [],
      reportedQuestions: [],
      reportedComments: [],
      reports: [],
      currentSort: "Most Popular",
      showError: "white", 
      animation: "none",
      title: "Knowledge Share",
      questionError: "Submit Question",
      topBorder: "#EFEFEF",
      showQuestion:true,
      showFilters: false,
      showSort: false,
      showRecent: false, 
      showReportModal: false,
      modalVisible: false
    }
    this.signin = fbc.signin()
      .then(user => this.user = user)

    this.signin.catch(err => console.error(err))
  }

  componentDidMount(){
    this.signin.then(() => {
      mapPerUserPublicPushedDataToStateObjects(fbc, 'questions', this, 'questions', (userId, key, value) => key)
      mapPushedDataToStateObjects(fbc.database.public.userRef('questionVotes'), this, 'myVotesByQuestion')
      mapPushedDataToStateObjects(fbc.database.public.userRef('answerVotes'), this, 'myVotesByAnswer')
      mapPerUserPublicPushedDataToObjectOfStateObjects(fbc, 'answers', this, 'answersByQuestion', (userId, key, value) => value.questionId, (userId, key, value) => key)
      reducePerUserPublicDataToStateCount(fbc, 'questionVotes', this, 'votesByQuestion', (userId, key, value) => key)
      reducePerUserPublicDataToStateCount(fbc, 'answerVotes', this, 'votesByAnswer', (userId, key, value) => key)
      const reportRef = fbc.database.private.adminableUserRef('reports')
      reportRef.on('child_added', data => {
        this.setState({ reports: [...this.state.reports, data.key ] })
      })
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

  resetFilters = () => {
    const filters = this.state.filters.concat(this.state.selectedFilters)
    const selectedFilters = []
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
          <FilterSelect handleChange={this.handleChange} filters={this.state.filters} selectedFilters={this.state.selectedFilters} addFilter={this.addFilter} removeFilter={this.removeFilter} resetFilters={this.resetFilters}/>
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
          reportedQuestions={this.state.reportedQuestions}
          reports={this.state.reports}
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
            reportedQuestions={this.state.reportedQuestions}
            reportedComments={this.state.reportedComments}
            reports={this.state.reports}
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
        <TouchableOpacity onPress={() => this.closeAnswer()} style={s.back}></TouchableOpacity>
      )
    }
  }

  closeAnswer = () => {
    this.setState({showQuestion: true, questionError: "Submit Question"})
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
    const reportTime = new Date().getTime()
    const isQuestion = ((question.questionId) ? false : true)
    const questionId = ((question.questionId) ? question.questionId : '')
      ref('reports').child(question.id).set({
        reportTime,
        isQuestion,
        questionId,
        block: false,
        approved: false
      })
      .then(() => {
        this.setState({showReportModal: false})
      })
  }



  sortTopics = (currentSort) => {
    this.setState({currentSort, showSort: false})
  }

  showComments = (question) => {
    this.setState({question, showQuestion: false, questionError: "Submit Answer"})
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
    const answerVotes = Object.keys(this.state.myVotesByAnswer)
    const questionVotes = Object.keys(this.state.myVotesByQuestion)
    if (c.questionId) {
      const isVoted = answerVotes.find(item => item === c.id) || false
      if (isVoted) {
        fbc.database.public.userRef('answerVotes').child(c.id).remove()
      }
      else {
        fbc.database.public.userRef('answerVotes').child(c.id).set(true)
      }
    }
    else { 
      const isVoted = questionVotes.find(item => item === c.id) || false
      if (isVoted) {
        fbc.database.public.userRef('questionVotes').child(c.id).remove()
      }
      else {
        fbc.database.public.userRef('questionVotes').child(c.id).set(true)
      }
    }
  }


}

export default HomeView

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  wholeBarEmulator: {
    backgroundColor: new Color().rgbString(),
    opacity: 0.9,
    top: 0,
    width: '100%',
    zIndex: 1000000
  },
  wholeBar: {
  },
  topSpace: {
    height: Platform.select({ios: topSpaceHeight, android: 0})
  },
  spacer: {
    height: Platform.select({ios: barHeight, android: 0}),
    justifyContent: 'center',
    alignItems: 'center'
  },
  emulatorTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17
  },
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
