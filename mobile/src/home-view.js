import React, { PureComponent } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Modal,
} from 'react-native'
import client, { TitleBar, Color, translate as t, useStrings } from '@doubledutch/rn-client'
import {
  provideFirebaseConnectorToReactComponent,
  mapPerUserPublicPushedDataToStateObjects,
  mapPerUserPublicPushedDataToObjectOfStateObjects,
  reducePerUserPublicDataToStateCount,
  mapPushedDataToStateObjects,
} from '@doubledutch/firebase-connector'
import i18n from './i18n'
import MyList from './Table'
import CustomModal from './Modal'
import HomeHeader from './HomeHeader'
import FilterSelect from './FilterSelect'
import SortSelect from './SortSelect'
import ReportModal from './ReportModal'
import LoadingView from "./LoadingView"

useStrings(i18n)

const topSpaceHeight = 21
const barHeight = 43

class HomeView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      question: '',
      report: '',
      disable: false,
      questions: {},
      answersByQuestion: {},
      votesByQuestion: {},
      votesByAnswer: {},
      myVotesByQuestion: {},
      myVotesByAnswer: {},
      filters: [],
      selectedFilters: [],
      reportedQuestions: [],
      reportedComments: [],
      reports: [],
      currentSort: t('popular'),
      showError: false,
      animation: 'none',
      title: 'Knowledge Share',
      questionError: t('submitQ'),
      topBorder: '#EFEFEF',
      showQuestion: true,
      showFilters: false,
      showSort: false,
      showRecent: false,
      showReportModal: false,
      modalVisible: false,
      questionPrompt: "",
      answerPrompt: "",
      buttonPrompt: "",
      answerButtonPrompt: "",
      buttonPromptPlural: "",
      answerButtonPromptPlural: "",
      edit: {}
    }

    this.signin = props.fbc.signin()
    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    const { fbc } = this.props
    client.getPrimaryColor().then(primaryColor => this.setState({ primaryColor }))
    client.getCurrentUser().then(currentUser => {
      this.setState({ currentUser })
      this.signin.then(() => {
        mapPerUserPublicPushedDataToStateObjects(
          fbc,
          'questions',
          this,
          'questions',
          (userId, key, value) => key,
        )
        mapPushedDataToStateObjects(
          fbc.database.public.userRef('questionVotes'),
          this,
          'myVotesByQuestion',
        )
        mapPushedDataToStateObjects(
          fbc.database.public.userRef('answerVotes'),
          this,
          'myVotesByAnswer',
        )
        mapPerUserPublicPushedDataToObjectOfStateObjects(
          fbc,
          'answers',
          this,
          'answersByQuestion',
          (userId, key, value) => value.questionId,
          (userId, key, value) => key,
        )
        reducePerUserPublicDataToStateCount(
          fbc,
          'questionVotes',
          this,
          'votesByQuestion',
          (userId, key, value) => key,
        )
        reducePerUserPublicDataToStateCount(
          fbc,
          'answerVotes',
          this,
          'votesByAnswer',
          (userId, key, value) => key,
        )
        const reportRef = fbc.database.private.adminableUserRef('reports')
        reportRef.on('child_added', data => {
          this.setState({ reports: [...this.state.reports, data.key] })
        })
        fbc.database.public
        .adminRef('questionPrompt')
        .on('value', data => {
          const prompt = data.val() || ""
          this.setState({ questionPrompt: prompt.trim() })
        })
        fbc.database.public
        .adminRef('answerPrompt')
        .on('value', data => {
          const prompt = data.val() || ""
          this.setState({ answerPrompt: prompt.trim() })
        })
        fbc.database.public
        .adminRef('buttonPrompt')
        .on('value', data => {
          const prompt = data.val() || ""
          if (prompt.trim()){
            this.setState({ buttonPrompt: prompt.trim(), questionError: t("customSubmit", {prompt: prompt.trim()}) })
          }
          else {
          this.setState({ buttonPrompt: "", questionError: t("submitQ") })
          }
        })
        fbc.database.public
        .adminRef('answerButtonPrompt')
        .on('value', data => {
          const prompt = data.val() || ""
          this.setState({ answerButtonPrompt: prompt.trim() || "Answer" })
        })
        fbc.database.public
        .adminRef('buttonPromptPlural')
        .on('value', data => {
          const prompt = data.val() || ""
          this.setState({ buttonPromptPlural: prompt.trim() || "" })
        })
        fbc.database.public
        .adminRef('answerButtonPromptPlural')
        .on('value', data => {
          const prompt = data.val() || ""
          this.setState({ answerButtonPromptPlural: prompt.trim() || "Answers" })
        })
        this.hideLogInScreen = setTimeout(() => {
          this.setState( {isLoggedIn: true})
        }, 500)
      })
    }).catch(e => this.setState({logInFailed: true}))
  }

  componentDidUpdate(prevProps, prevState){
    if (Object.keys(this.state.questions).length !== Object.keys(prevState.questions).length){
      this.organizeFilters()
    }
  }

  render() {
    const { suggestedTitle } = this.props
    const { currentUser, primaryColor } = this.state
    if (!currentUser || !primaryColor) return null
    return (
      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.select({ ios: 'padding', android: null })}
      >
        <TitleBar title={suggestedTitle || this.state.title} client={client} signin={this.signin} />
        {this.state.isLoggedIn ? 
        this.masterRender() : <LoadingView logInFailed={this.state.logInFailed}/>}
      </KeyboardAvoidingView>
    )
  }

  masterRender = () => {
    return (
      <View style={{ flex: 1 }}>
        {this.modalControl()}
        {this.renderHome()}
        {this.renderFooter()}
      </View>
    )
  }

  modalControl = () => (
    <Modal
      animationType="none"
      transparent
      visible={this.state.showReportModal}
      onRequestClose={() => {
        alert('Modal has been closed.')
      }}
    >
      <ReportModal
        handleChange={this.handleChange}
        reportQuestion={this.reportQuestion}
        report={this.state.report}
        primaryColor={this.state.primaryColor}
      />
    </Modal>
  )

  organizeFilters = () => {
    const filters = []
    const questions = Object.values(this.state.questions).filter(
      question => question.block === false,
    )
      questions.forEach(item => {
        if (item.filters) {
          item.filters.forEach(filter => {
            filters.push(filter)
          })
        }
      })
      filters.sort()
      this.countFilters(filters)
  }

  addFilter = selected => {
    const filters = this.state.filters
    const index = filters.indexOf(selected)
    const filter = filters.splice(index, 1)
    const selectedFilters = this.state.selectedFilters.concat(filter)
    this.setState({ filters, selectedFilters })
  }

  removeFilter = selected => {
    const selectedFilters = this.state.selectedFilters
    const index = selectedFilters.indexOf(selected)
    const filter = selectedFilters.splice(index, 1)
    const filters = this.state.filters.concat(filter)
    this.setState({ filters, selectedFilters })
  }

  resetFilters = () => {
    const filters = this.state.filters.concat(this.state.selectedFilters)
    const selectedFilters = []
    this.setState({ filters, selectedFilters })
  }

  countFilters = filters => {
    const newFilters = []
    let current = null
    let cnt = 0
    for (let i = 0; i < filters.length; i++) {
      if (filters[i] != current) {
        if (cnt > 0) {
          const filter = { title: current, count: cnt }
          newFilters.push(filter)
        }
        current = filters[i]
        cnt = 1
      } else {
        cnt++
      }
    }
    if (cnt > 0) {
      const filter = { title: current, count: cnt }
      newFilters.push(filter)
    }
    this.setState({ filters: newFilters })
  }

  renderHome = () => {
    if (this.state.showFilters) {
      return (
        <View style={{ flex: 1 }}>
          <FilterSelect
            handleChange={this.handleChange}
            filters={this.state.filters}
            selectedFilters={this.state.selectedFilters}
            addFilter={this.addFilter}
            removeFilter={this.removeFilter}
            resetFilters={this.resetFilters}
            primaryColor={this.state.primaryColor}
            currentUser={this.state.currentUser}
          />
        </View>
      )
    }
    if (this.state.showSort) {
      return (
        <View style={{ flex: 1 }}>
          <SortSelect
            handleChange={this.handleChange}
            sortTopics={this.sortTopics}
            currentSort={this.state.currentSort}
            lastSort={this.state.buttonPromptPlural ? t("customPrompt", { prompt: this.state.buttonPromptPlural }) : t("questions")}
          />
        </View>
      )
    }

    if (this.state.modalVisible === false) {
      return (
        <View style={{ flex: 1 }}>
          <HomeHeader
            showModal={this.showModal}
            showQuestion={this.state.showQuestion}
            question={this.state.question}
            showFilters={this.state.showFilters}
            votesByQuestion={this.state.votesByQuestion}
            reportQuestion={this.reportQuestion}
            newVote={this.newVote}
            handleChange={this.handleChange}
            handleReport={this.handleReport}
            handleEdit={this.handleEditQ}
            reportedQuestions={this.state.reportedQuestions}
            reports={this.state.reports}
            primaryColor={this.state.primaryColor}
            currentUser={this.state.currentUser}
            questionPrompt={this.state.questionPrompt}
            answerPrompt={this.state.answerPrompt}
            buttonPrompt={this.state.buttonPrompt}
            edit={this.state.edit}
          />
          <View style={{ flex: 1 }}>
            <MyList
              questions={this.state.questions}
              question={this.state.question}
              votesByQuestion={this.state.votesByQuestion}
              showModal={this.showModal}
              newVote={this.newVote}
              showQuestion={this.state.showQuestion}
              handleChange={this.handleChange}
              showComments={this.showComments}
              comments={this.state.answersByQuestion}
              votesByAnswer={this.state.votesByAnswer}
              currentSort={this.state.currentSort}
              emptyStateTitle={this.state.emptyStateTitle}
              selectedFilters={this.state.selectedFilters}
              reportQuestion={this.reportQuestion}
              handleReport={this.handleReport}
              handleEdit={this.handleEdit}
              reportedQuestions={this.state.reportedQuestions}
              reportedComments={this.state.reportedComments}
              reports={this.state.reports}
              primaryColor={this.state.primaryColor}
              currentUser={this.state.currentUser}
              answerPrompt={this.state.answerPrompt}
              buttonPrompt={this.state.buttonPrompt}
              buttonPromptPlural={this.state.buttonPromptPlural}
              answerButtonPrompt={this.state.answerButtonPrompt}
              answerButtonPromptPlural={this.state.answerButtonPromptPlural}
            />
          </View>
        </View>
      )
    }

    return (
      <CustomModal
        showModal={this.showModal}
        makeTrue={this.makeTrue}
        createSharedQuestion={this.createSharedQuestion}
        createSharedComment={this.createSharedComment}
        disable={this.state.disable}
        question={this.state.question}
        showError={this.state.showError}
        handleChange={this.handleChange}
        hideModal={this.hideModal}
        modalVisible={this.state.modalVisible}
        questionError={this.state.questionError}
        style={{ flex: 1 }}
        showQuestion={this.state.showQuestion}
        filters={this.state.filters}
        votesByAnswer={this.state.votesByAnswer}
        votesByQuestion={this.state.votesByQuestion}
        primaryColor={this.state.primaryColor}
        currentUser={this.state.currentUser}
        questionPrompt={this.state.questionPrompt}
        answerPrompt={this.state.answerPrompt}
        edit={this.state.edit}
      />
    )
  }

  renderFooter = () => {
    const { primaryColor } = this.state
    if (this.state.showQuestion === false && this.state.modalVisible === false) {
      return (
        <TouchableOpacity
          onPress={() => this.closeAnswer()}
          style={[s.back, { backgroundColor: primaryColor }]}
        >
          <Text style={s.backText}>{t('close')}</Text>
        </TouchableOpacity>
      )
    }
  }

  closeAnswer = () => {
    const prompt = this.state.buttonPrompt ? this.state.buttonPrompt : "Question"
    this.setState({ showQuestion: true, questionError: t("customSubmit", {prompt}) })
  }

  showModal = () => {
    this.setState({ modalVisible: true, animation: 'none' })
  }

  hideModal = () => {
    this.setState({ modalVisible: false, animation: 'slide', showError: false, edit: {} })
  }

  handleReport = item => {
    this.setState({ showReportModal: true, report: item })
  }
  handleEdit = item => {
    this.setState({ modalVisible: true, animation: 'none', edit: item })
  }

  handleEditQ = item => {
    const prompt = this.state.buttonPrompt ? this.state.buttonPrompt : "Question"
    this.setState({ modalVisible: true, showQuestion: true, edit: item, questionError: t("customSubmit", {prompt})  })
  }

  reportQuestion = question =>
    this.createReport(this.props.fbc.database.private.adminableUserRef, question)

  createReport = (ref, question) => {
    const reportTime = new Date().getTime()
    const isQuestion = !question.questionId
    const questionId = question.questionId ? question.questionId : ''
    ref('reports')
      .child(question.id)
      .set({
        reportTime,
        isQuestion,
        questionId,
        block: false,
        approved: false,
      })
      .then(() => {
        this.setState({ showReportModal: false })
      })
  }

  sortTopics = currentSort => {
    this.setState({ currentSort, showSort: false })
  }

  showComments = question => {
    this.setState({ question, showQuestion: false, questionError: `Submit ${this.state.answerButtonPrompt || t('submitA')}` })
  }

  handleChange = (prop, value) => {
    this.setState({ [prop]: value })
  }

  createSharedQuestion = (question, filters) =>
    this.createQuestion(this.props.fbc.database.public.userRef, question, filters)

  createQuestion = (ref, question, filters) => {
    const time = new Date().getTime()
    const questionName = question.trim()
    if (questionName.length === 0) {
      this.setState({ showError: true })
    }
    if (questionName.length > 0) {
      if (this.state.edit.id) {
        ref('questions')
        .child(this.state.edit.id).update({
          text: questionName,
          lastEdit: time,
          filters,
        })
        .then(() => {
          this.setState({ question: '', showError: false, edit: {} })
          setTimeout(() => {
            this.hideModal()
          }, 250)
        })
        .catch(error => this.setState({ questionError: t('retry') }))
      }
      else {
        ref('questions')
        .push({
          text: questionName,
          creator: this.state.currentUser,
          comments: [],
          dateCreate: time,
          block: false,
          lastEdit: time,
          filters,
        })
        .then(() => {
          this.setState({ question: '', showError: false })
          setTimeout(() => {
            this.hideModal()
          }, 250)
        })
        .catch(error => this.setState({ questionError: t('retry') }))
      }
    }
  }

  createSharedComment = comment =>
    this.createComment(this.props.fbc.database.public.userRef, comment)

  createComment = (ref, comment) => {
    const time = new Date().getTime()
    const commentName = comment.trim()
    if (commentName.length === 0) {
      this.setState({ showError: true })
    }
    if (commentName.length > 0) {
      if (this.state.edit.id){
        ref('answers')
        .child(this.state.edit.id)
        .update({
          text: commentName,
          creator: this.state.currentUser,
          dateCreate: time,
          block: false,
          lastEdit: time,
          questionId: this.state.question.id,
        })
        .then(() => {
          this.setState({ showError: false, edit: {} })
          setTimeout(() => {
            this.hideModal()
          }, 250)
        })
        .catch(error => this.setState({ questionError: t('retry') }))
      }
      else { 
        ref('answers')
        .push({
          text: commentName,
          creator: this.state.currentUser,
          dateCreate: time,
          block: false,
          lastEdit: time,
          questionId: this.state.question.id,
        })
        .then(() => {
          this.setState({ showError: false })
          setTimeout(() => {
            this.hideModal()
          }, 250)
        })
        .catch(error => this.setState({ questionError: t('retry') }))
      }
    }
  }

  newVote = c => {
    const { fbc } = this.props
    const answerVotes = Object.keys(this.state.myVotesByAnswer)
    const questionVotes = Object.keys(this.state.myVotesByQuestion)
    if (c.questionId) {
      const isVoted = answerVotes.find(item => item === c.id) || false
      if (isVoted) {
        fbc.database.public
          .userRef('answerVotes')
          .child(c.id)
          .remove()
      } else {
        fbc.database.public
          .userRef('answerVotes')
          .child(c.id)
          .set(true)
      }
    } else {
      const isVoted = questionVotes.find(item => item === c.id) || false
      if (isVoted) {
        fbc.database.public
          .userRef('questionVotes')
          .child(c.id)
          .remove()
      } else {
        fbc.database.public
          .userRef('questionVotes')
          .child(c.id)
          .set(true)
      }
    }
  }
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'knowledgeshare',
  (props, fbc) => <HomeView {...props} fbc={fbc} />,
  PureComponent,
)

const s = StyleSheet.create({
  wholeBarEmulator: {
    backgroundColor: new Color().rgbString(),
    opacity: 0.9,
    top: 0,
    width: '100%',
    zIndex: 1000000,
  },
  wholeBar: {},
  topSpace: {
    height: Platform.select({ ios: topSpaceHeight, android: 0 }),
  },
  spacer: {
    height: Platform.select({ ios: barHeight, android: 0 }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emulatorTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
  },
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  back: {
    height: 40,
    margin: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 16,
    color: 'white',
  },
  textBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  checkmark: {
    height: 16,
    width: 16,
    marginTop: 4,
  },
  circleBox: {
    marginTop: 20,
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
})
