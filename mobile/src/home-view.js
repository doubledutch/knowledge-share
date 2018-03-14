'use strict'
import React, { Component } from 'react'
import ReactNative, {
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Image, Modal
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
import MyList  from './Table'
import CustomModal from './Modal'
const fbc = FirebaseConnector(client, 'knowledgeshare')
fbc.initializeAppWithSimpleBackend()

class HomeView extends Component {
  constructor() {
    super()
    this.state = {
      question: '', 
      vote: '', 
      disable: false, 
      questions: [], 
      sharedVotes: [], 
      characterCount: 0, 
      showRecent: false, 
      showError: "white", 
      modalVisible: false, 
      color: 'white', 
      height: 20, 
      newValue: '', 
      marginTop: 18, 
      animation: "none",
      title: "Knowledge Share",
      questionError: "Ask Question",
      topBorder: "#EFEFEF",
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
      </KeyboardAvoidingView> 
    )
  }

  renderHome = () => {
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

    const { questions, sharedVotes, showRecent, dropDown, newValue, height, marginTop } = this.state
    var pinnedQuestions = this.state.questions.filter(item => item.pin === true && item.block === false)
    var otherQuestions = this.state.questions.filter(item => item.pin === false && item.block === false)
    this.originalOrder(pinnedQuestions)
    this.originalOrder(otherQuestions)
    let newQuestions = pinnedQuestions.concat(otherQuestions)
    if (this.state.modalVisible === false){
      return(
      <View style={{flex:1}}>
        <View style={s.textBox}>
            <TouchableOpacity style={s.circleBox} onPress={this.showModal}><Text style={s.whiteText}>?</Text></TouchableOpacity>
            <TextInput  underlineColorAndroid='transparent' style={Platform.select({ios: newStyle, android: [newStyle, androidStyle]})} placeholder="Type your question here"
              value={this.state.question}
              autoFocus={false}
              onFocus={this.showModal}
              multiline={true}
              placeholderTextColor="#9B9B9B"
            />
        </View>
        <View style={{flex:1}}>
          <MyList 
            questions={newQuestions}
            showModal = {this.showModal}
            findOrder = {this.findOrder}
            showRecent = {this.state.showRecent}
            findOrderDate = {this.findOrderDate}
            originalOrder = {this.originalOrder}
            newVote = {this.newVote}
          />
        </View>
      </View>
      )
    } else {
      return(
        <CustomModal 
          showModal = {this.showModal}
          makeTrue = {this.makeTrue}
          createSharedTask = {this.createSharedTask}
          disable = {this.state.disable}
          question = {this.state.question}
          showError = {this.state.showError}
          hideModal = {this.hideModal}
          modalVisible = {this.state.modalVisible}
          questionError = {this.state.questionError}
          style={{flex:1}}
        />
      )
    }
  }

  renderIcon = (question) => {
    if (question.myVote === true){
      return <TouchableOpacity onPress={() => this.newVote(question)}><Image style={s.checkmark} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/question-and-answer/Active.png"}}/></TouchableOpacity>
    }
    else {
      return <TouchableOpacity onPress={() => this.newVote(question)}><Image style={s.checkmark} source={{uri: "https://dml2n2dpleynv.cloudfront.net/extensions/question-and-answer/Inactive.png"}}/></TouchableOpacity>
    }
  }

  showModal = () => {
    this.setState({modalVisible: true, animation: "none"})
  }

  hideModal = () => {
      this.setState({modalVisible: false, animation: "slide", showError: "white"})
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

    dateSort = (questions) => {
      questions.sort(function (a,b){
        return b.dateCreate - a.dateCreate
      })
    }

    findOrder = () => {
      this.setState({showRecent: false})
    }

    findOrderDate = () => {
      this.setState({showRecent: true})
    }

    createSharedTask = (question, anom) => this.createQuestion(fbc.database.public.allRef, question, anom)
  
    createQuestion = (ref, question, anom) => {
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
          anom: anom,
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
