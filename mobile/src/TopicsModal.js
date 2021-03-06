import React, { Component } from 'react'
import ReactNative, {
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  ScrollView,
} from 'react-native'
import client, { translate as t } from '@doubledutch/rn-client'
import FilterCell from './FilterCell'

export default class TopicsModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      topic: '',
      color: 'white',
      borderColor: '#EFEFEF',
      inputHeight: 0,
      search: false,
      newList: [],
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
      marginBottom: 10,
    }

    const iosStyle = {
      marginTop: 20,
      marginBottom: 10,
    }

    let newColor = '#9B9B9B'
    if (this.props.session) {
      newColor = this.props.primaryColor
    }

    const colorStyle = {
      backgroundColor: newColor,
    }

    let borderColor = this.state.borderColor
    if (this.props.showError === 'red') {
      borderColor = 'red'
    }
    const borderStyle = { borderColor }

    const { modalClose, makeQuestion, handleChange, primaryColor } = this.props

    return (
      <View style={{ flex: 1 }}>
        <View style={[s.modal, borderStyle]}>
          <TouchableOpacity style={s.circleBox}>
            <Text style={s.whiteText}>?</Text>
          </TouchableOpacity>
          <TextInput
            style={Platform.select({
              ios: [newStyle, iosStyle],
              android: [newStyle, androidStyle],
            })}
            placeholder={t('begin')}
            value={this.state.topic}
            onChangeText={topic => this.updateList(topic)}
            maxLength={25}
            autoFocus={this.state.edit}
            multiline
            placeholderTextColor="#9B9B9B"
            onContentSizeChange={event => this._handleSizeChange(event)}
          />
          <Text style={s.counter}>{25 - this.state.topic.length} </Text>
        </View>
        {this.filtersTable()}
        <View style={s.bottomButtons}>
          <TouchableOpacity
            style={[s.topicsButton, { borderColor: primaryColor }]}
            onPress={() => handleChange('showTopics', false)}
          >
            <Text style={[s.topicsButtonText, { color: primaryColor }]}>{t('back')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.sendButton, { backgroundColor: primaryColor }]}
            onPress={() => makeQuestion()}
          >
            <Text style={s.sendButtonText}>{this.props.questionError}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.modalBottom} onPress={modalClose} />
      </View>
    )
  }

  _handleSizeChange = event => {
    this.setState({
      inputHeight: event.nativeEvent.contentSize.height,
    })
  }

  filtersTable = () => {
    const { currentUser, primaryColor, selectedFilters } = this.props
    let currentList = this.props.filters
    if (this.state.search) currentList = this.state.newList
    if (!this.state.search) {
      return (
        <View style={s.table2}>
          <ScrollView horizontal>
            {selectedFilters.map((item, i) => (
              <FilterCell
                item={item}
                key={i}
                select
                removeFilter={this.props.removeFilter}
                primaryColor={primaryColor}
                currentUser={currentUser}
              />
            ))}
            {selectedFilters.length < 8 && currentList.map((item, i) => (
              <FilterCell
                item={item}
                key={i}
                select={false}
                addFilter={this.addFilter}
                primaryColor={this.props.primaryColor}
                currentUser={currentUser}
              />
            ))}
          </ScrollView>
        </View>
      )
    }

    return (
      <View>
        {selectedFilters.length >= 8 ? <View style={s.table2}><Text style={s.topicHelpText}>{t('remove_topics')}</Text></View> : <View style={s.table2}>
          <TouchableOpacity disabled={!this.state.topic.trim().length} onPress={this.addNewTopic}>
            <Text style={[s.topicsButtonText, { color: primaryColor }]}>{t('create')}</Text>
          </TouchableOpacity>
          {currentList.length ? (
            <ScrollView horizontal>
              {currentList.map((item, i) => (
                <FilterCell
                  item={item}
                  key={i}
                  select={this.props.selectedFilters.includes(item)}
                  addFilter={this.addFilter}
                  primaryColor={this.props.primaryColor}
                  currentUser={currentUser}
                  removeFilter={this.props.removeFilter}
                />
              ))}
            </ScrollView>
          ) : (
            <Text style={s.suggestionHelpText}>{t('no_suggestions')}</Text>
          )}
        </View>}
      </View>
    )
  }

  addFilter = item => {
    this.props.addFilter(item)
    this.setState({ topic: '', search: false })
  }

  addNewTopic = () => {
    const topic = this.state.topic.trim()
    const allFilter = !!this.props.filters.find(
      item => item.title.toLowerCase() === topic.toLowerCase(),
    )
    const selectFilter = !!this.props.selectedFilters.find(
      item => item.title.toLowerCase() === topic.toLowerCase(),
    )
    if (!allFilter && !selectFilter) {
      this.props.newFilter(topic)
      this.setState({ topic: '', search: false })
    }
  }

  updateList = value => {
    const list = this.props.filters.concat(this.props.selectedFilters)
    const queryText = value.toLowerCase()
    if (queryText.length > 0) {
      const queryResult = []
      list.forEach(content => {
        const title = content.title
        if (title) {
          if (title.toLowerCase().indexOf(queryText) !== -1) {
            queryResult.push(content)
          }
        }
      })
      this.setState({ search: true, newList: queryResult, topic: value })
    } else {
      this.setState({ search: false, topic: value })
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
    marginTop: 23,
    width: 30,
    fontSize: 14,
    marginRight: 11,
    height: 20,
    color: '#9B9B9B',
    textAlign: 'center',
  },
  topicHelpText: {
    color: '#9B9B9B',
    marginLeft: 10
  },
  suggestionHelpText: {
    color: '#9B9B9B',
  },
  table2: {
    flexDirection: 'row',
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
  },
  subText: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  nameText: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  questionText: {
    fontSize: 16,
    color: '#404040',
    fontFamily: 'System',
    marginBottom: 5,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingTop: 20,
  },
  modal: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  modalBottom: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
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
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: '#9B9B9B',
    paddingLeft: 8,
    paddingRight: 8,
    height: 22,
    borderRadius: 50,
  },
  topicsButton: {
    justifyContent: 'center',
    marginRight: 10,
    height: 42,
    width: 124,
    borderRadius: 4,
    borderWidth: 1,
  },
  topicsButtonText: {
    fontSize: 14,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    marginRight: 10,
    width: 124,
    height: 42,
    borderRadius: 4,
  },
  sendButtonText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  whiteText: {
    fontSize: 18,
    color: 'white',
  },
})
