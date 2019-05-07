import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'
import { Avatar, translate as t } from '@doubledutch/rn-client'
import FilterCell from './FilterCell'
import ReportButton from './ReportButton'

export default class TableCell extends Component {
  render() {
    const { item } = this.props

    return <View>{this.renderCell(item)}</View>
  }

  renderCell = item => {
    const { primaryColor, currentUser, answerButtonPrompt, answerButtonPromptPlural } = this.props
    const voteCount = item.questionId
      ? this.props.votesByAnswer[item.id] || 0
      : this.props.votesByQuestion[item.id] || 0

    let buttonPrompt = this.props.commentsTotal === 1
      ? t('one_answer')
      : t('answers_count', { count: this.props.commentsTotal })
  
    if (answerButtonPrompt && answerButtonPromptPlural) buttonPrompt = `${this.props.commentsTotal} ${this.props.commmentsTotal === 1 ? answerButtonPrompt : answerButtonPromptPlural}`

    if (this.props.showQuestion) {
      return (
        <TouchableOpacity style={s.listContainer} onPress={() => this.props.showComments(item)}>
          <View style={s.rightContainer}>
            <Text style={s.boldText}>{item.text}</Text>
            <View style={s.buttonContainer}>
              <Avatar user={item.creator} size={20} style={{ marginRight: 8, marginLeft: 5 }} />
              <Text numberOfLines={2} style={s.nameText}>
                {item.creator.firstName} {item.creator.lastName}
              </Text>
              <View style={{ flex: 1 }} />
              <Text style={s.voteText}>{t('votes', { count: voteCount })}</Text>
              <Text style={s.subText}>
                {buttonPrompt}
              </Text>
            </View>
            {this.renderFilters(item)}
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <View style={s.listContainer}>
        <View style={s.rightContainer}>
          <Text style={s.questionText}>{item.text}</Text>
          <View style={s.buttonContainer}>
            <Avatar user={item.creator} size={20} style={{ marginRight: 8, marginLeft: 5 }} />
            <Text numberOfLines={2} style={s.nameText}>
              {item.creator.firstName} {item.creator.lastName}
            </Text>
          </View>
          <View style={s.voteContainer}>
            <TouchableOpacity
              style={[s.upVoteButton, { backgroundColor: primaryColor }]}
              onPress={() => this.props.newVote(item)}
            >
              <Text style={s.upVoteText}>{t('upvote', { count: voteCount })}</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <ReportButton
              report={this.props.reportQuestion}
              item={item}
              handleReport={this.props.handleReport}
              isReported={this.props.isReported}
              currentUser={currentUser}
            />
          </View>
        </View>
      </View>
    )
  }

  renderFilters = item => {
    const { primaryColor } = this.props
    let filters = []
    if (item.filters) filters = item.filters
    return (
      <View style={s.table2}>
        {filters.map((item, i) => (
          <FilterCell
            item={item}
            key={i}
            state
            primaryColor={primaryColor}
            currentUser={this.props.currentUser}
          />
        ))}
      </View>
    )
  }

  renderIcon = item => (
    <TouchableOpacity onPress={() => this.props.newVotes(item)}>
      <Image
        style={s.checkmark}
        source={{
          uri: 'https://dml2n2dpleynv.cloudfront.net/extensions/question-and-answer/Inactive.png',
        }}
      />
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
  },
  voteContainer: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  upVoteButton: {
    alignContent: 'center',
    height: 30,
    paddingHorizontal: 10,
    margin: 10,
    marginLeft: 0,
    justifyContent: 'center',
    borderRadius: 5,
  },
  table2: {
    flexDirection: 'row',
    backgroundColor: 'white',
    flexWrap: 'wrap',
  },
  subText: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  voteText: {
    fontSize: 14,
    marginRight: 5,
    color: '#9B9B9B',
  },
  upVoteText: {
    color: 'white',
  },
  nameText: {
    fontSize: 14,
    color: '#9B9B9B',
    width: 100,
  },
  questionText: {
    fontSize: 16,
    color: '#404040',
    fontFamily: 'System',
    marginBottom: 5,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#404040',
    fontFamily: 'System',
    marginBottom: 5,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 2,
    minHeight: 60,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  leftContainer: {
    flexDirection: 'column',
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  rightContainer: {
    flex: 1,
    width: '80%',
    paddingLeft: 15,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
  },
  checkmark: {
    height: 16,
    width: 16,
    marginTop: 4,
  },
})
