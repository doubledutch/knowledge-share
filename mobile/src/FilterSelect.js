import React, { Component } from 'react'
import { Platform, StyleSheet, TouchableOpacity, Text, TextInput, View, Image } from 'react-native'
import { translate as t } from '@doubledutch/rn-client'
import FilterCell from './FilterCell'
import { magnify } from './images'

export default class FilterSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      newList: [],
      search: false,
      inputHeight: 0
    }
    this.s = createStyles(props)
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {this.topicsHeader()}
        {this.searchBar()}
        {this.currentTable()}
        {this.selectTable()}
        {this.renderText()}
      </View>
    )
  }

  renderText = () => {
    if (this.state.search && this.state.newList.length === 0) {
      return (
        <View style={{ marginTop: 25, marginHorizontal: 10 }}>
          <Text style={this.s.helpText}>{t('bummer')}</Text>
        </View>
      )
    }
  }

  currentTable = () => {
    if (this.props.selectedFilters.length)
      return (
        <View style={this.s.table}>
          {this.props.selectedFilters.map((item, i) => (
            <FilterCell
              item={item}
              key={i}
              select
              removeFilter={this.props.removeFilter}
              primaryColor={this.props.primaryColor}
              currentUser={this.props.currentUser}
            />
          ))}
        </View>
      )
  }

  selectTable = () => {
    let filters = this.props.filters
    if (this.state.search) filters = this.state.newList
    return (
      <View style={this.s.table}>
        {filters.map((item, i) => (
          <FilterCell
            item={item}
            key={i}
            select={false}
            addFilter={this.newFilterAdd}
            primaryColor={this.props.primaryColor}
            currentUser={this.props.currentUser}
          />
        ))}
      </View>
    )
  }

  newFilterAdd = item => {
    this.props.addFilter(item)
    this.updateList('')
  }

  topicsHeader = () => (
    <View style={this.s.buttonContainer}>
      <TouchableOpacity onPress={() => this.props.handleChange('showFilters', false)}>
        <Text style={this.s.closeButton}>X</Text>
      </TouchableOpacity>
      <Text style={this.s.title}>{t('topics')}</Text>
      <TouchableOpacity>
        <Text style={this.s.clearButton} onPress={() => this.resetFilters()}>
          {t('clear')}
        </Text>
      </TouchableOpacity>
    </View>
  )

  updateList = value => {
    const queryText = value.trim().toLowerCase()
    if (queryText.length > 0) {
      const queryResult = []
      this.props.filters.forEach(content => {
        const title = content.title
        if (title) {
          if (title.toLowerCase().indexOf(queryText) !== -1) {
            queryResult.push(content)
          }
        }
      })
      this.setState({ newList: queryResult, search: value })
    } else {
      this.setState({ search: value })
    }
  }

  resetFilters = () => {
    this.setState({ search: '' })
    this.props.resetFilters()
  }

  searchBar = () => {
    const newStyle = {
      flex: 1,
      fontSize: 18,
      color: '#404040',
      textAlignVertical: 'top',
      maxHeight: 100,
      height: Math.max(35, this.state.inputHeight),
      paddingTop: 0,
    }
    const androidStyle = {
      paddingLeft: 0,
      marginTop: 17,
      marginBottom: 10,
    }
    const iosStyle = {
      marginTop: 20,
      marginBottom: 10,
    }
    return (
      <View style={this.s.modal}>
        <Image style={this.s.pencilBox} source={magnify} />
        <TextInput
          style={Platform.select({ ios: [newStyle, iosStyle], android: [newStyle, androidStyle] })}
          placeholder={t('search')}
          value={this.state.search}
          onChangeText={search => this.updateList(search)}
          maxLength={250}
          autoFocus={false}
          multiline
          placeholderTextColor="#9B9B9B"
          onContentSizeChange={event => this._handleSizeChange(event)}
        />
      </View>
    )
  }

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height,
    })
  }
}

const createStyles = props =>
  StyleSheet.create({
    table: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      height: 60,
      alignItems: 'center',
    },
    box: {
      marginBottom: 25,
    },
    textBox: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#EFEFEF',
    },
    pencilBox: {
      marginTop: 22,
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 20,
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      width: 15,
      height: 15,
    },
    whiteText: {
      fontSize: 18,
      color: 'white',
    },
    title: {
      fontSize: 24,
      flex: 1,
      textAlign: 'center',
      color: '#9B9B9B',
    },
    closeButton: {
      marginLeft: 20,
      color: props.primaryColor,
      fontWeight: '900',
      fontSize: 16,
    },
    helpText: {
      marginRight: 20,
      color: '#9B9B9B',
    },
    clearButton: {
      marginRight: 20,
      color: props.primaryColor,
    },
    button1: {
      height: 40,
      paddingTop: 10,
      marginBottom: 10,
      justifyContent: 'center',
      borderBottomWidth: 2,
      borderBottomColor: props.primaryColor,
    },
    button2: {
      height: 40,
      paddingTop: 10,
      marginBottom: 10,
      justifyContent: 'center',
    },
    divider: {
      flex: 1,
    },
    modal: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#EFEFEF',
    },
    dividerSm: {
      width: 30,
    },
    dashboardButton: {
      fontSize: 18,
      color: '#9B9B9B',
    },
  })
