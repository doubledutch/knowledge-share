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

const fbc = FirebaseConnector(client, 'knowledgeshare')
fbc.initializeAppWithSimpleBackend()

class HomeView extends Component {
  constructor() {
    super()
    this.state = {
      question: '', 
      disable: false, 
      questions: [],
      comments: {},
      votes: {},
      showRecent: false, 
      showError: "white", 
      modalVisible: false, 
      animation: "none",
      title: "Knowledge Share",
      questionError: "Ask Question",
      topBorder: "#EFEFEF",
      showQuestion:true
    }
    this.signin = fbc.signin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  componentDidMount(){
    this.signin.then(() => {
      fbc.database.public.usersRef().on('child_added', data => {
        if (data.val().comments){this.organizeComments(data.val().comments)}
        if (data.val().votes){this.organizeVotes(data.val().votes, data.key)}
        if (data.val().questions){this.organizeQuestions(data.val().questions)}
      })

      fbc.database.public.usersRef().on('child_changed', data => {
        console.log(data.val())
      })
  
      fbc.database.public.userRef('votes').on('child_removed', data => {
        var currentVotes = this.state.votes
        currentVotes[data.val().commentKey].filter(x => {x.key !== data.key})
        this.setState({ votes: currentVotes })
      })
    })
  }

  render() {
    return (
      <KeyboardAvoidingView style={s.container} behavior={Platform.select({ios: "padding", android: null})}>
        <TitleBar title={this.state.title} client={client} signin={this.signin} />
        {this.renderHome()}
        {this.renderFooter()}
      </KeyboardAvoidingView> 
    )
  }

  organizeComments = (newComments) => {
    var comments = this.state.comments
    for (var i in newComments){
      var comment = newComments[i]
      const commentsForQuestion = comments[comment.questionId]
      if (commentsForQuestion) {
        var newCommentsForQuestion = [...commentsForQuestion, {...comment, key: i}]
      } else {
        var newCommentsForQuestion = [{...comment, key: i}]
      }
      comments = {...comments, [comment.questionId]: newCommentsForQuestion}
    }
    this.setState({comments})
  }

  organizeQuestions = (newQuestions) => {
    var questions = this.state.questions
    for (var i in newQuestions){
      var question = newQuestions[i]
      questions = [...questions, {...question, key: i}]
    }
    this.setState({ questions }) 
  }

  organizeVotes = (newVotes, id) => {
    var votes = this.state.votes
    for (var i in newVotes){
      var vote = newVotes[i]
      const votesForQuestion = this.state.votes[vote.commentKey]
      if (votesForQuestion) {
        var newVotesForQuestion = [...votesForQuestion, {...vote, key: i, user: id}]
      } else {
        var newVotesForQuestion = [{...vote, key: i, user: id}]
      }
      votes = {...votes, [vote.commentKey]: newVotesForQuestion}
    }
    this.setState({votes})
  }

 


  renderHome = () => {
    let newQuestions = this.state.questions
    if (this.state.modalVisible === false){
      return(
      <View style={{flex:1}}>
        <HomeHeader
          showModal={this.showModal}
          showQuestion={this.state.showQuestion}
          question={this.state.question}
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
        lastEdit: time
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
