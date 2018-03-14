'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'

export default class CustomModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      question: '', 
      anom: false,
      color: 'white', 
      borderColor: '#EFEFEF',
      inputHeight: 0
    }
  }

  modalClose = () => {
    this.setState({anom: false, color: 'white'})
    this.props.hideModal()
  }

  makeQuestion = (question, anom) => {
    this.props.createSharedTask(question, anom)
    this.setState({question: '', anom: false})
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
      return (
        <View style={{flex: 1}}>
          <View style={[s.modal, borderStyle]}>
              <TouchableOpacity style={s.circleBox}><Text style={s.whiteText}>?</Text></TouchableOpacity>
              <TextInput style={Platform.select({ios: [newStyle, iosStyle], android: [newStyle, androidStyle]})} placeholder="Type your question here"
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
          <View style={s.bottomButtons}>
            <View style={s.rightBox}>
              <Text style={{color: this.props.showError, paddingTop: 2, fontSize: 12, marginLeft: 10}}>*Please enter a question</Text>
              <View style={s.anomBox}>
                <Avatar user={client.currentUser} client={client} size={20} style={{marginRight: 8, marginTop: 15, marginLeft: 10}} />
                <Text style={s.anomText}>{client.currentUser.firstName + " " + client.currentUser.lastName}</Text>
              </View>
            </View>
            <TouchableOpacity style={s.sendButton} onPress={() => this.makeQuestion(this.state.question, this.state.anom)}><Text style={s.sendButtonText}>{this.props.questionError}</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={s.modalBottom} onPress={this.modalClose}></TouchableOpacity> 
        </View>
      )
    }

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height
    });
  };

}

const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  bottomButtons: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 82
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
  anomBox: {
    flex: 1,
    flexDirection: 'row',
  },
  rightBox: {
    flex: 1,
    flexDirection: 'column',
  },
  anomText: {
    flex:1,
    fontSize: 14,
    color: '#364247',
    marginLeft: 5,
    marginTop: 16,
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
  sendButton: {
    justifyContent: 'center',
    marginTop: 20,
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
