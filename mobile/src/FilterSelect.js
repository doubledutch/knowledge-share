'use strict'
import React, { Component } from 'react'
import ReactNative, {
  Platform, TouchableOpacity, Text, TextInput, View, ScrollView, FlatList, Modal, Image
} from 'react-native'
import client, { Avatar, TitleBar, Color } from '@doubledutch/rn-client'
import FilterCell from './FilterCell'

export default class FilterSelect extends Component {
  constructor(props){
    super(props)
    this.state = {
      question: '',
      newList: [],
      search: false
    }
  }

  render() { 
    return (
      <View style={{flex:1, backgroundColor: 'white'}}>
        {this.topicsHeader()}
        {this.searchBar()}
        {this.currentTable()}
        {this.selectTable()}
        {this.renderText()}
      </View>
    )
  }

  renderText = () => {
    if (this.state.search && this.state.newList.length === 0){
      return (
        <View style={{marginTop: 25, marginHorizontal: 10}}>
          <Text style={s.helpText}>Bummer! This search isn't returning any results</Text>
        </View>
      )
    }
  }

  currentTable = () => {
    if (this.props.selectedFilters.length) return (
      <View style={s.table}>
        { this.props.selectedFilters.map((item, i) => {
         return (
          <FilterCell item={item} key={i} select={true} removeFilter={this.props.removeFilter}/>
         )
        }) }
      </View>
    )
  }

  selectTable = () => {
    var filters = this.props.filters
    if (this.state.search) filters = this.state.newList
    return (
      <View style={s.table}>
        { filters.map((item, i) => {
          return (
            <FilterCell item={item} key={i} select={false} addFilter={this.props.addFilter}/>
          )
      }) }
      </View>
    )
  }


  topicsHeader = () => {
    return (
      <View style={s.buttonContainer}>
        <TouchableOpacity onPress={() => this.props.handleChange("showFilters", false)}><Text style={s.closeButton}>X</Text></TouchableOpacity>
        <Text style={s.title}>Topics</Text>
        <TouchableOpacity><Text style={s.clearButton} onPress={() => this.props.resetFilters()}>Clear</Text></TouchableOpacity>
      </View>
    )
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
      this.setState({search: true, newList: queryResult, question: value})
    }
    else {
      this.setState({search: false, question: value})
    }
  }

  searchBar = () => {
    const newStyle = {
      flex: 1,
      fontSize: 18,
      color: "#404040",
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
    return (
      <View style={s.modal}>
        <TouchableOpacity style={s.circleBox}><Text style={s.whiteText}>?</Text></TouchableOpacity>
        <TextInput style={Platform.select({ios: [newStyle, iosStyle], android: [newStyle, androidStyle]})} placeholder={"Search"}
          value={this.state.question}
          onChangeText={question => this.updateList(question)} 
          maxLength={250}
          autoFocus={false}
          multiline={true}
          placeholderTextColor="#9B9B9B"
          onContentSizeChange={(event) => this._handleSizeChange(event)}
        />
      </View>
    )
  }

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height
    });
  };
}

const fontSize = 18
const s = ReactNative.StyleSheet.create({
  table: {
    flexDirection: "row",
    flexWrap: 'wrap',
    marginTop: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: "center"
  },
  box: {
    marginBottom: 25
  },
  textBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EFEFEF'
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
  },
  title: {
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
    color: '#9B9B9B'
  },
  closeButton: {
    marginLeft: 20
  },
  helpText: {
    marginRight: 20,
    color: '#9B9B9B'
  },
  clearButton: {
    marginRight: 20,
    color: client.primaryColor
  },
  button1: {
    height: 40,
    paddingTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: client.primaryColor
  },
  button2: {
    height: 40,
    paddingTop: 10,
    marginBottom: 10,
    justifyContent: 'center', 
  },
  divider: {
    flex: 1
  },
  modal: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  dividerSm: {
    width: 30
  },
  dashboardButton: {
    fontSize: 18,
    color: '#9B9B9B'
  }
})
