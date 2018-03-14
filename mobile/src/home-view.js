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
      this.downloadQuestions()
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

  renderHome = () => {
    var pinnedQuestions = this.state.questions.filter(item => item.pin === true && item.block === false)
    var otherQuestions = this.state.questions.filter(item => item.pin === false && item.block === false)
    this.originalOrder(pinnedQuestions)
    this.originalOrder(otherQuestions)
    let newQuestions = pinnedQuestions.concat(otherQuestions)

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
            showModal = {this.showModal}
            showRecent = {this.state.showRecent}
            originalOrder = {this.originalOrder}
            newVote = {this.newVote}
            showQuestion ={this.state.showQuestion}
            handleChange={this.handleChange}
            showComments={this.showComments}
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
  
  downloadQuestions = () => {
      fbc.database.public.allRef('questions').on('child_added', data => {
        this.setState({ questions: [...this.state.questions, {...data.val(), key: data.key }] })
        fbc.database.public.allRef('votes').child(data.key).on('child_added', vote => {
          const isThisMyVote = vote.key === client.currentUser.id
          this.setState(prevState => ({
            questions: prevState.questions.map(question => 
              question.key === data.key
                ? { ...question, myVote: question.myVote || isThisMyVote, score: question.score + 1}
                : question
            )
          }))
        })
        fbc.database.public.allRef('votes').child(data.key).on('child_removed', vote => {
          const wasThisMyVote = vote.key === client.currentUser.id
          this.setState(prevState => ({
            questions: prevState.questions.map(question => 
              question.key === data.key
                ? { ...question, myVote: question.myVote && !wasThisMyVote, score: question.score - 1}
                : question
            )
          }))
        })
      })
      fbc.database.public.allRef('questions').on('child_changed', data => {
        var questions = this.state.questions
        for (var i in questions) {
          if (questions[i].key === data.key) {
            var score = questions[i].score
            var myVote = questions[i].myVote
            questions[i] = data.val()
            questions[i].score = score
            questions[i].myVote = myVote
            questions[i].key = data.key
            this.setState({questions})
            break
          }
        }
      })
      fbc.database.public.allRef('questions').on('child_removed', data => {
        this.setState({ questions: this.state.questions.filter(x => x.key !== data.key) })
      })
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

    createSharedQuestion = (question, anom) => this.createQuestion(fbc.database.public.allRef, question)
  
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
          score : 0,
          dateCreate: time,
          block: false,
          pin: false,
          lastEdit: time
        })
        .then(() => {
          this.setState({question: '', anom: false, showError: "white"})
          setTimeout(() => {
            this.hideModal()
            }
            ,250)
        })
        .catch(error => this.setState({questionError: "Retry"}))
      }
    }

    
    createSharedComment = (comment) => this.createComment(fbc.database.public.allRef, comment)
  
    createComment = (ref, comment) => {
      var time = new Date().getTime()
      var commentName = comment.trim()
      if (commentName.length === 0) {
        this.setState({showError: "red"})
      }
      if (this.user && commentName.length > 0) {
        ref('comments').child(this.state.question.key).push({
          text: commentName,
          creator: client.currentUser,
          score : 0,
          dateCreate: time,
          block: false,
          pin: false,
          lastEdit: time
        })
        .then(() => {
          this.setState({question: '', anom: false, showError: "white"})
          setTimeout(() => {
            this.hideModal()
            }
            ,250)
        })
        .catch(error => this.setState({questionError: "Retry"}))
      }
    }

    newVote = (question) => {
      if (question.myVote === true) {
        fbc.database.public.allRef("votes").child(question.key).child(client.currentUser.id).remove()
      }
      else {
        fbc.database.public.allRef('votes').child(question.key).child(client.currentUser.id).set(1)
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
