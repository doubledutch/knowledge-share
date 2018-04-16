'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import TopicsModal from './TopicsModal'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'

export default class CustomModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      question: '',
      color: 'white',  
      borderColor: '#EFEFEF',
      inputHeight: 0,
      showTopics: false,
      selectedFilters : []
    }
  }

  modalClose = () => {
    this.setState({color: 'white'})
    this.props.hideModal()
  }

  makeQuestion = () => {
    var newFilters = []
    this.state.selectedFilters.map((item) => { newFilters.push(item.title) })
    if (this.props.showQuestion) {
      this.props.createSharedQuestion(this.state.question, newFilters)
      this.setState({question: '', showTopics: false})
    }
    else {
      this.props.createSharedComment(this.state.question, newFilters)
      this.setState({question: '', showTopics: false})
    }
  }

  renderQuestion = () => {
    const question = this.props.question
    if (this.props.showQuestion === false) {
      return (
        <View style={s.listContainer}>
          <View style={s.rightContainer}>
            <Text style={s.questionText}>{question.text}</Text>
            <View style={s.buttonContainer}>
              <Avatar user={question.creator} size={20} style={{marginRight: 8, marginLeft: 5}} />
              <Text style={s.nameText}>{question.creator.firstName} {question.creator.lastName}</Text>
            </View>
          </View>
        </View>
      )
    }

  }

  render() {
    const newStyle = {
      flex: 1,
      fontSize: 18,
      color: '#9B9B9B',
      textAlignVertical: 'top',
      maxHeight: 100,
      height: Math.max(35, this.state.inputHeight),
      paddingTop: 0,
    }
    
    const androidStyle = {
      paddingLeft: 0,
      marginTop: 17,
      marginBottom: 10
    }

    const iosStyle = {
      marginTop: 20,
      marginBottom: 10,
    }
    
    var newColor = "#9B9B9B"
    if (this.props.session){
      newColor = client.primaryColor
    }

    const colorStyle = {
      backgroundColor: newColor
    }

      var borderColor = this.state.borderColor
      if (this.props.showError === "red"){borderColor = "red"}
      const borderStyle = {borderColor: borderColor}
      if (this.state.showTopics === false) {
        return (
        <View style={{flex: 1}}>
          {this.renderQuestion()}
          <View style={[s.modal, borderStyle]}>
              <TouchableOpacity style={s.circleBox}><Text style={s.whiteText}>?</Text></TouchableOpacity>
              <TextInput style={Platform.select({ios: [newStyle, iosStyle], android: [newStyle, androidStyle]})} placeholder={this.props.showQuestion ? "What is your question?" : "Add your own answer"}
                value={this.state.question}
                onChangeText={question => this.setState({question})} 
                maxLength={250}
                autoFocus={true}
                multiline={true}
                placeholderTextColor="#9B9B9B"
                onContentSizeChange={(event) => this._handleSizeChange(event)}
              />
              <Text style={s.counter}>{250 - this.state.question.length} </Text>
          </View>
          <Text style={{color: this.props.showError, paddingTop: 2, fontSize: 12, marginLeft: 10, backgroundColor: "#FFFFFF"}}>*Please enter a valid message</Text>
          <View style={s.bottomButtons}>
            <TouchableOpacity style={s.topicsButton} onPress={() => this.handleChange("showTopics", true)}><Text style={s.topicsButtonText}>Add Topics</Text></TouchableOpacity>
            <TouchableOpacity style={s.sendButton} onPress={() => this.makeQuestion()}><Text style={s.sendButtonText}>{this.props.questionError}</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={s.modalBottom} onPress={this.modalClose}></TouchableOpacity> 
        </View>
        )
      }
      else {
        return (
          <TopicsModal modalClose={this.modalClose} makeQuestion={this.makeQuestion} handleChange={this.handleChange} filters={this.props.filters} selectedFilters={this.state.selectedFilters} addFilter={this.addFilter} removeFilter={this.removeFilter} newFilter={this.newFilter}/>
        )
      }
    }

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height
    });
  };

  handleChange = (prop, value) => {
    this.setState({[prop]: value})
  }
  addFilter = (selected) => {
    var filters = this.props.filters
    var index = filters.indexOf(selected)
    var filter = filters.splice(index, 1)
    const selectedFilters = this.state.selectedFilters.concat(filter)
    this.setState({filters, selectedFilters})
  }

  removeFilter = (selected) => {
    var selectedFilters = this.state.selectedFilters
    var index = selectedFilters.indexOf(selected)
    var filter = selectedFilters.splice(index, 1)
    const filters = this.props.filters.concat(filter)
    this.setState({filters, selectedFilters})
  }

  newFilter = (selected) => {
    var filter = {title: selected, count: 1}
    const selectedFilters = this.state.selectedFilters.concat(filter)
    this.setState({selectedFilters})

  }

}

const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
  },
  subText:{
    fontSize: 12,
    color: '#9B9B9B'
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
  listContainer: {
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: 'white',
    marginBottom: 1,
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 5,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 60
  },
  modal: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  modalBottom: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5
  },
  button: {
    width: '25%',
    height: 40,
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: 'center',
  },
  rightBox: {
    flex: 1,
    flexDirection: 'column',
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
  counter: {
    justifyContent: 'center',
    marginTop:23,
    width: 30,
    fontSize: 14,
    marginRight: 11,
    height: 20,
    color: '#9B9B9B', 
    textAlign: 'center'
  },
  topicsButton: {
    justifyContent: 'center',
    marginRight: 10,
    width: 124,
    borderColor: client.primaryColor,
    height: 42,
    borderRadius: 4,
    borderWidth: 1
  },
  topicsButtonText: {
    fontSize: 14,
    color: client.primaryColor,
    textAlign: 'center'
  },
  sendButton: {
    justifyContent: 'center',
    marginRight: 10,
    width: 124,
    backgroundColor: client.primaryColor,
    height: 42,
    borderRadius: 4,
  },
  sendButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center'
  },
  whiteText: {
    fontSize: 18,
    color: 'white',
  }
})
