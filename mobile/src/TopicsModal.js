'use strict'
import React, { Component } from 'react'
import ReactNative, { Platform, TouchableOpacity, Text, TextInput, View, ScrollView } from 'react-native'
import client, { translate as t } from '@doubledutch/rn-client'
import FilterCell from './FilterCell'

export default class TopicsModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      topic: '',
      color: 'white', 
      borderColor: '#EFEFEF',
      inputHeight: 0,
      search: false,
      newList: []
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
      newColor = this.props.primaryColor
    }

    const colorStyle = {
      backgroundColor: newColor
    }

    var borderColor = this.state.borderColor
    if (this.props.showError === "red"){borderColor = "red"}
    const borderStyle = {borderColor: borderColor}

    const { modalClose, makeQuestion, handleChange, primaryColor } = this.props

    return (
      <View style={{flex: 1}}>
        <View style={[s.modal, borderStyle]}>
          <TouchableOpacity style={s.circleBox}><Text style={s.whiteText}>?</Text></TouchableOpacity>
          <TextInput style={Platform.select({ios: [newStyle, iosStyle], android: [newStyle, androidStyle]})} placeholder={t("begin")}
            value={this.state.topic}
            onChangeText={topic => this.updateList(topic)} 
            maxLength={25}
            autoFocus={this.state.edit}
            multiline={true}
            placeholderTextColor="#9B9B9B"
            onContentSizeChange={(event) => this._handleSizeChange(event)}
          />
          <Text style={s.counter}>{25 - this.state.topic.length} </Text>
        </View>
        {this.filtersTable()}
        <View style={s.bottomButtons}>
          <TouchableOpacity style={[s.topicsButton, {borderColor: primaryColor}]} onPress={() => handleChange("showTopics", false)}><Text style={[s.topicsButtonText, {color: primaryColor}]}>{t("back")}</Text></TouchableOpacity>
          <TouchableOpacity style={[s.sendButton, {backgroundColor: primaryColor}]} onPress={() => makeQuestion()}><Text style={s.sendButtonText}>{t("submitQ")}</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={s.modalBottom} onPress={modalClose}></TouchableOpacity> 
      </View>
    )
  }

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height
    });
  }

  filtersTable = () => {
    const {currentUser, primaryColor} = this.props
    var currentList = this.props.filters
    if (this.state.search) currentList = this.state.newList
    if (this.state.search === false) {
      return (
        <View style={s.table2}>
        <ScrollView horizontal={true}>
          { this.props.selectedFilters.map((item, i) => {
          return (
            <FilterCell item={item} key={i} select={true} removeFilter={this.props.removeFilter} primaryColor={primaryColor} currentUser={currentUser} />
          )
          }) }
          { currentList.map((item, i) => {
            return (
              <FilterCell item={item} key={i} select={false} addFilter={this.addFilter} primaryColor={this.props.primaryColor} currentUser={currentUser} />
            )
          }) }
        </ScrollView>
        </View>
      )
    }
    else {
      return (
        <View style={s.table2}>
        <TouchableOpacity disabled={!this.state.topic.trim().length} onPress={this.addNewTopic}><Text style={[s.topicsButtonText, {color: primaryColor}]}>{t("create")}</Text></TouchableOpacity>
        { currentList.length ? <ScrollView horizontal={true}>
          { currentList.map((item, i) => {
            return (
              <FilterCell item={item} key={i} select={false} addFilter={this.addFilter} primaryColor={this.props.primaryColor} currentUser={currentUser} />
            )
          }) }
        </ScrollView> : <Text style={{color: '#9B9B9B'}}>{t("no_suggestions")}</Text>
        }
        </View>
      )
    }
  }

  addFilter = (item) => {
    this.props.addFilter(item)
    this.setState({topic: '', search: false})
  }

  addNewTopic = () => {
    const topic = this.state.topic.trim()
    const allFilter = (this.props.filters.find(item => item.title.toLowerCase() === topic.toLowerCase()) ? true : false)
    const selectFilter = (this.props.selectedFilters.find(item => item.title.toLowerCase() === topic.toLowerCase()) ? true : false)
    if (!allFilter && !selectFilter) {
      this.props.newFilter(topic)
      this.setState({topic: '', search: false})
    }
  }

  updateList = (value) => {
    var queryText = value.toLowerCase()
    if (queryText.length > 0){
      var queryResult=[];
      this.props.filters.forEach(function(content){
        var title = content.title
        if (title) {
          if (title.toLowerCase().indexOf(queryText)!== -1){
            queryResult.push(content);
          }
        }
      });
      this.setState({search: true, newList: queryResult, topic: value})
    }
    else {
      this.setState({search: false, topic: value})
    }
  }

}


const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
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
  table2: {
    flexDirection: "row",
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
    alignItems: 'center',
    backgroundColor: "white"
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
    height: 82,
    paddingTop: 20
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
  topicsButton: {
    justifyContent: 'center',
    marginRight: 10,
    height: 42,
    borderRadius: 4,
    borderWidth: 1
  },
  topicsButtonText: {
    fontSize: 14,
    marginHorizontal: 10,
    textAlign: 'center'
  },
  sendButton: {
    justifyContent: 'center',
    marginRight: 10,
    height: 42,
    borderRadius: 4,
  },
  sendButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 10
  },
  whiteText: {
    fontSize: 18,
    color: 'white',
  }
})
