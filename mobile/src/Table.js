import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import TableHeader from './TableHeader'
import TableCell from './TableCell'

const getId = item => item.id
export class MyList extends Component {
  render() {
    const {
      newVote,
      showQuestion,
      showComments,
      handleReport,
      primaryColor,
      currentUser,
      comments
    } = this.props
    const data = this.verifyData()
    return (
      <View>
        {this.renderHeader(showQuestion)}
        <FlatList
          data={data}
          extraData={comments}
          ListFooterComponent={<View style={{ height: 100 }} />}
          keyExtractor={getId}
          renderItem={({ item }) => {
            const isReported = this.isReported(item)
            return (
              <TableCell
                item={item}
                commentsTotal={this.totalComments(item.id)}
                newVote={newVote}
                votesByAnswer={this.props.votesByAnswer}
                votesByQuestion={this.props.votesByQuestion}
                showQuestion={showQuestion}
                showComments={showComments}
                handleReport={handleReport}
                isReported={isReported}
                primaryColor={primaryColor}
                currentUser={currentUser}
              />
            )
          }}
        />
      </View>
    )
  }

  isReported = item => {
    const { reports } = this.props
    return !!(reports && reports.find(q => q === item.id))
  }

  verifyData = () => {
    let questions = Object.values(this.props.questions)
    if (this.props.showQuestion) {
      questions = questions.filter(question => question.block === false)
      return this.originalOrder(questions)
    }

    if (this.props.comments) {
      const comments = this.props.comments[this.props.question.id]
      if (comments) {
        return this.commentsOrder(comments)
      }

      return []
    }

    return []
  }

  totalComments = key => {
    let total = 0
    const comments = this.props.comments[key]
    if (comments) {
      total = Object.values(comments).filter(item => !item.block).length
    }
    return total
  }

  commentsOrder = comments => {
    const votes = this.props.votesByAnswer || 0
    let sortComments = Object.values(comments)
    sortComments = sortComments.filter(comment => comment.block === false)
    this.dateSort(sortComments)
    sortComments.sort((a, b) => {
      const voteCount = votes[a.id] || 0 ? votes[a.id] : 0
      const voteCount2 = votes[b.id] || 0 ? votes[b.id] : 0
      return voteCount2 - voteCount
    })
    return sortComments
  }

  originalOrder = questions => {
    const { currentSort, selectedFilters, currentUser } = this.props
    const votes = this.props.votesByQuestion || 0
    if (questions) {
      if (currentSort === 'My Questions') {
        return questions.filter(item => item.creator.id === currentUser.id)
      }
      if (currentSort === 'Most Popular') {
        this.dateSort(questions)
        questions.sort((a, b) => {
          const voteCount = votes[a.id] || 0 ? votes[a.id] : 0
          const voteCount2 = votes[b.id] || 0 ? votes[b.id] : 0
          return voteCount2 - voteCount
        })
      } else if (currentSort === 'Most Recent') {
        this.dateSort(questions)
      }

      if (selectedFilters.length > 0) {
        const searchFilters = selectedFilters.map(f => f.title)
        questions = questions.filter(
          q => q.filters && q.filters.some(f => searchFilters.includes(f)),
        )
      }

      return questions
    }
    return []
  }

  dateSort = questions => {
    questions.sort((a, b) => b.dateCreate - a.dateCreate)
  }

  renderHeader = showQuestion => {
    if (showQuestion) {
      return (
        <TableHeader
          questions={this.props.questions}
          showRecent={this.props.showRecent}
          showModal={this.props.showModal}
          handleChange={this.props.handleChange}
          currentSort={this.props.currentSort}
          selectedFilters={this.props.selectedFilters}
          currentUser={this.props.currentUser}
          primaryColor={this.props.primaryColor}
        />
      )
    }
  }
}

export default MyList
