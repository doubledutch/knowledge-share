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
      disable: false, 
      questions: {},
      answersByQuestion: {},
      votesByQuestion: {},
      votesByAnswer: {},
      filters: [],
      showRecent: false, 
      showError: "white", 
      modalVisible: false, 
      animation: "none",
      title: "Knowledge Share",
      questionError: "Ask Question",
      topBorder: "#EFEFEF",
      showQuestion:true,
      showFilters: false
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
        { Object.values(this.state.questions).map(q => (
          <View key={q.id}>
            <Text>{q.id}: ({this.state.votesByQuestion[q.id] || 0}) {q.text}</Text>
            { Object.values(this.state.answersByQuestion[q.id] || {}).map(a => (
              <Text key={a.id}>    {a.id}: ({this.state.votesByAnswer[a.id] || 0}) {a.text}</Text>
            ))}
          </View>
        ))}
        {/* {this.renderHome()}
        {this.renderFooter()} */}
      </KeyboardAvoidingView> 
    )
  }

  // organizeComments = (newComments) => {
  //   var comments = {}
  //   for (var i in newComments){
  //     var comment = newComments[i]
  //     const commentsForQuestion = comments[comment.questionId]
  //     if (commentsForQuestion) {
  //       var newCommentsForQuestion = [...commentsForQuestion, {...comment, key: i}]
  //     } else {
  //       var newCommentsForQuestion = [{...comment, key: i}]
  //     }
  //     comments = {...comments, [comment.questionId]: newCommentsForQuestion}
  //   }
  //   this.setState({comments})
  // }

  // organizeQuestions = (newQuestions) => {
  //   var questions = []
  //   var filters = []
  //   for (var i in newQuestions){
  //     var question = newQuestions[i]
  //     var filter = question.filters
  //     questions = [...questions, {...question, key: i}]
  //     filters = {...filters, ...filter}
  //     console.log(filters)
  //   }
  //   this.organizeFilters(questions)
  //   this.setState({ questions}) 
  // }

  // organizeVotes = (newVotes, id) => {
  //   var votes = {}
  //   for (var i in newVotes){
  //     var vote = newVotes[i]
  //     const votesForQuestion = votes[vote.commentKey]
  //     if (votesForQuestion) {
  //       var newVotesForQuestion = [...votesForQuestion, {...vote, key: i, user: id}]
  //     } else {
  //       var newVotesForQuestion = [{...vote, key: i, user: id}]
  //     }
  //     votes = {...votes, [vote.commentKey]: newVotesForQuestion}
  //   }
  //   this.setState({votes})
  // }

  organizeFilters = (questions) => {
    var filters = []
    Object.values(questions).map((item) => {
      if (item.filters) {
        item.filters.map((filter) => {
          filters.push(filter)
        })
      }
    })
    filters.sort()
    this.countFilters(filters)
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
    let newQuestions = Object.keys(this.state.questions)
    if (this.state.showFilters) {
      return(
        <View style={{flex:1}}>
          <FilterSelect handleChange={this.handleChange}/>
        </View>
      )
    }

    if (this.state.modalVisible === false){
      return(
      <View style={{flex:1}}>
        <HomeHeader
          showModal={this.showModal}
          showQuestion={this.state.showQuestion}
          question={this.state.question}
          showFilters={this.state.showFilters}
        />
        <View style={{flex:1}}>
          <MyList 
            questions={newQuestions}
            question={this.state.question}
            showModal = {this.showModal}
            showRecent = {this.state.showRecent}
            originalOrder = {this.originalOrder}
            newVote = {this.newVote}
            showQuestion ={this.state.showQuestion}
            handleChange={this.handleChange}
            showComments={this.showComments}
            comments = {this.state.comments}
            votes = {this.state.votes}
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
  }

  hideModal = () => {
    this.setState({modalVisible: false, animation: "slide", showError: "white"})
  }

  flagQuestion = () => {

  }

  sortTopics = () => {

  }

  originalOrder = (questions) => {
    if (this.state.showRecent === false) {
      this.dateSort(questions)
      questions.sort(function (a,b){ 
        return b.score - a.score
      })
    }
    if (this.state.showRecent === true) {
      this.dateSort(questions)
    }
  }

  showComments = (question) => {
    this.handleChange("question", question)
    this.handleChange("showQuestion", false)
  }

  dateSort = (questions) => {
    questions.sort(function (a,b){
      return b.dateCreate - a.dateCreate
    })
  }

  handleChange = (prop, value) => {
    this.setState({[prop]: value})
  }

  createSharedQuestion = (question) => this.createQuestion(fbc.database.public.userRef, question)

  createQuestion = (ref, question) => {
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
        filters: ["pizza", "food"]
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
      ref('comments').push({
        text: commentName,
        creator: client.currentUser,
        dateCreate: time,
        block: false,
        lastEdit: time,
        questionId: this.state.question.key
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

  newVote = (c, myVote) => {
    if (myVote) {
      fbc.database.public.userRef("votes").child(myVote.key).remove()
    }
    else {
      fbc.database.public.userRef('votes').push({
        commentKey: c.key,
        value: 1
      })
      .then(() => this.setState({vote: ''}))
      .catch(x => console.error(x))
    }
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
