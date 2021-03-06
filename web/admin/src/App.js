/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { PureComponent } from 'react'
import './App.css'
import { CSVDownload } from '@doubledutch/react-csv'
import client, { translate as t, useStrings } from '@doubledutch/admin-client'
import {
  provideFirebaseConnectorToReactComponent,
  mapPerUserPublicPushedDataToStateObjects,
  mapPerUserPublicPushedDataToObjectOfStateObjects,
  mapPerUserPrivateAdminablePushedDataToObjectOfStateObjects,
} from '@doubledutch/firebase-connector'
import i18n from './i18n'
import CustomInputs from './CustomInputs'
import CustomCell from './cell'
import AllQuestionsContainer from './AllQuestionsContainer'
import '@doubledutch/react-components/lib/base.css'

useStrings(i18n)

class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      reports: {},
      allUsers: [],
      reportedQuestions: [],
      blockedQuestions: [],
      questions: {},
      answersByQuestion: {},
      reportComments: {},
      location: 0,
      questionKey: '',
      totalFlagged: 0,
      totalBlocked: 0,
      isExporting: false,
      exportList: [],
      questionPrompt: '',
      answerPrompt: '',
      buttonPrompt: '',
      answerButtonPrompt: '',
      buttonPromptPlural: '',
      answerButtonPromptPlural: '',
    }
    this.signin = props.fbc
      .signinAdmin()
      .then(user => (this.user = user))
      .catch(err => console.error(err))
  }

  componentDidMount() {
    const { fbc } = this.props
    this.signin.then(() => {
      client.getAttendees().then(users => {
        this.setState({ allUsers: users })
        mapPerUserPublicPushedDataToStateObjects(
          fbc,
          'questions',
          this,
          'questions',
          (userId, key, value) => key,
        )
        mapPerUserPublicPushedDataToObjectOfStateObjects(
          fbc,
          'answers',
          this,
          'answersByQuestion',
          (userId, key, value) => value.questionId,
          (userId, key, value) => key,
        )
        mapPerUserPrivateAdminablePushedDataToObjectOfStateObjects(
          fbc,
          'reports',
          this,
          'reports',
          (userId, key, value) => key,
          userId => userId,
        )
        fbc.database.public
          .adminRef('questionPrompt')
          .on('value', data => this.setState({ questionPrompt: data.val() || '' }))
        fbc.database.public
          .adminRef('answerPrompt')
          .on('value', data => this.setState({ answerPrompt: data.val() || '' }))
        fbc.database.public
          .adminRef('buttonPrompt')
          .on('value', data => this.setState({ buttonPrompt: data.val() || '' }))
        fbc.database.public
          .adminRef('answerButtonPrompt')
          .on('value', data => this.setState({ answerButtonPrompt: data.val() || '' }))
        fbc.database.public
          .adminRef('buttonPromptPlural')
          .on('value', data => this.setState({ buttonPromptPlural: data.val() || '' }))
        fbc.database.public
          .adminRef('answerButtonPromptPlural')
          .on('value', data => this.setState({ answerButtonPromptPlural: data.val() || '' }))
      })
    })
  }

  returnTotal(isReport) {
    let total = 0
    const questionOrAnswerIds = Object.keys(this.state.reports)
    if (isReport) {
      questionOrAnswerIds.forEach((task, i) => {
        const questionOrAnswerReports = this.getReport(task)
        const allReportsFlagged = Object.values(questionOrAnswerReports).filter(
          item => item.block !== true && item.approved !== true,
        )
        if (allReportsFlagged.length) {
          total += 1
        }
      })
    } else {
      questionOrAnswerIds.forEach((task, i) => {
        const questionOrAnswerReports = this.getReport(task)
        const allReportsBlocked = Object.values(questionOrAnswerReports).filter(
          item => item.block === true && item.approved !== true,
        )
        if (allReportsBlocked.length) {
          total += 1
        }
      })
    }
    return total
  }

  renderMessage = (m1, m2, m3) => (
    <div className="modTextBox">
      <p className="bigModText">{m1}</p>
      <p className="smallModText">{m2}</p>
      <p className="smallModText">{m3}</p>
    </div>
  )

  render() {
    const questionOrAnswerIds = Object.keys(this.state.reports)
    const questionsOrAnswersAndReports = questionOrAnswerIds
      .map(id => {
        const reports = this.getReport(id)
        const questionOrAnswer = this.returnContent(reports, id)
        return { questionOrAnswer, reports }
      })
      .filter(x => x.questionOrAnswer)
      .sort((a, b) => {
        function latestReportTimeFor(x) {
          const reportsArray = Object.values(x.reports)
          return reportsArray.reduce((latest, report) => Math.max(report.reportTime, latest), 0)
        }
        return latestReportTimeFor(b) - latestReportTimeFor(a)
      })

    const totalBlocked = this.returnTotal(false)
    const totalReported = this.returnTotal(true)
    return (
      <div>
        <p className="bigBoxTitle">Knowledge Share</p>
        <div className="container">
          <div className="questionBox">
            <p className="boxTitle">Reports</p>
            <div className="cellBoxTop">
              <p className="listTitle">{t('reported', { totalReported })}</p>
              {!!totalReported && (
                <button
                  className="noBorderButton"
                  onClick={() => this.approveAll(questionsOrAnswersAndReports)}
                >
                  {t('approve_all')}
                </button>
              )}
              {!!totalReported && (
                <button
                  className="noBorderButton"
                  onClick={() => this.blockAll(questionsOrAnswersAndReports)}
                >
                  {t('block_all')}
                </button>
              )}
            </div>
            <ul
              className="listBox"
              ref={input => {
                this.flaggedList = input
              }}
            >
              {questionsOrAnswersAndReports.map(questionOrAnswerAndReport => {
                const id = questionOrAnswerAndReport.questionOrAnswer.id
                const allReportsFlagged = Object.values(questionOrAnswerAndReport.reports).filter(
                  item => item.block !== true && item.approved !== true,
                )
                if (allReportsFlagged.length) {
                  return (
                    <li className="cellBox" key={id}>
                      <CustomCell
                        currentKey={id}
                        returnQuestion={this.returnQuestion}
                        returnContent={this.returnContent}
                        markBlock={this.markBlock}
                        unBlock={this.approveQ}
                        getUser={this.getUser}
                        report={allReportsFlagged}
                        content={questionOrAnswerAndReport.questionOrAnswer}
                        singleReport={allReportsFlagged[0]}
                        allReportsFlagged={allReportsFlagged}
                      />
                    </li>
                  )
                }
              })}
              {totalReported
                ? null
                : this.renderMessage(t('report_display'), t('pending_display'), t('attendees'))}
            </ul>
          </div>
          <div className="questionBox">
            <div className="boxSpace" />
            <span>
              <p className="listTitle">{t('blocked', { totalBlocked })}</p>
            </span>
            <ul
              className="listBox2"
              ref={input => {
                this.blockedList = input
              }}
            >
              {questionsOrAnswersAndReports.map(questionOrAnswerAndReport => {
                const id = questionOrAnswerAndReport.questionOrAnswer.id
                const allReportsBlocked = Object.values(questionOrAnswerAndReport.reports).filter(
                  item => item.block === true && item.approved !== true,
                )
                if (allReportsBlocked.length) {
                  return (
                    <li key={id}>
                      <CustomCell
                        currentKey={id}
                        report={allReportsBlocked}
                        singleReport={allReportsBlocked[0]}
                        returnQuestion={this.returnQuestion}
                        returnContent={this.returnContent}
                        unBlock={this.unBlock}
                        getUser={this.getUser}
                        getReport={this.getReport}
                        content={questionOrAnswerAndReport.questionOrAnswer}
                      />
                    </li>
                  )
                }
              })}
              {totalBlocked
                ? null
                : this.renderMessage(
                    t('block_display'),
                    t('block_display_sec'),
                    t('block_display_three'),
                  )}
            </ul>
          </div>
        </div>
        <div className="csvLinkBox">
          <button className="csvButton" onClick={this.formatDataForExport}>
            {t('export')}
          </button>
          {this.state.isExporting ? (
            <CSVDownload data={this.state.exportList} filename="results.csv" target="_blank" />
          ) : null}
        </div>
        <AllQuestionsContainer
          fbc={this.props.fbc}
          questions={this.state.questions}
          answers={this.state.answersByQuestion}
        />
        <CustomInputs
          fbc={this.props.fbc}
          questionPrompt={this.state.questionPrompt}
          answerPrompt={this.state.answerPrompt}
          buttonPrompt={this.state.buttonPrompt}
          answerButtonPrompt={this.state.answerButtonPrompt}
          buttonPromptPlural={this.state.buttonPromptPlural}
          answerButtonPromptPlural={this.state.answerButtonPromptPlural}
        />
      </div>
    )
  }

  formatDataForExport = () => {
    const questions = Object.values(this.state.questions)
    const exportList = questions.map(question => {
      const exportObject = {
        Creator: `${question.creator.firstName} ${question.creator.lastName}`,
        Blocked: question.block ? 'Yes' : 'N/A',
        Question: question.text,
        Tags: question.filters ? question.filters : 'None',
      }
      if (this.state.answersByQuestion[question.id]) {
        Object.values(this.state.answersByQuestion[question.id]).forEach((item, i) => {
          exportObject[`Response_${i + 1}`] = item.text
          exportObject[
            `Response_${i + 1}_Creator`
          ] = `${item.creator.firstName} ${item.creator.lastName}`
        })
      } else exportObject.Responses = 'None'
      return exportObject
    })
    this.setState({ exportList, isExporting: true })
    setTimeout(() => this.setState({ isExporting: false }), 3000)
  }

  blockAll = questionsOrAnswersAndReports => {
    questionsOrAnswersAndReports.map(questionOrAnswerAndReport => {
      const currentKey = questionOrAnswerAndReport.questionOrAnswer.id
      const userId = questionOrAnswerAndReport.questionOrAnswer.userId
      const allReportsFlagged = Object.values(questionOrAnswerAndReport.reports).filter(
        item => item.block !== true && item.approved !== true,
      )
      this.markBlock(
        allReportsFlagged,
        currentKey,
        questionOrAnswerAndReport.questionOrAnswer.userId,
      )
    })
  }

  approveAll = questionsOrAnswersAndReports => {
    questionsOrAnswersAndReports.map(questionOrAnswerAndReport => {
      const currentKey = questionOrAnswerAndReport.questionOrAnswer.id
      const userId = questionOrAnswerAndReport.questionOrAnswer.userId
      const allReportsFlagged = Object.values(questionOrAnswerAndReport.reports).filter(
        item => item.block !== true && item.approved !== true,
      )
      this.approveQ(allReportsFlagged, currentKey, userId)
    })
  }

  markBlock = (reports, key, userId) => {
    const { fbc } = this.props
    if (reports.length && key && userId) {
      reports.forEach(item => {
        fbc.database.private
          .adminableUsersRef(item.userId)
          .child('reports')
          .child(key)
          .update({ block: true })
      })
      if (reports[0].isQuestion) {
        fbc.database.public
          .usersRef(userId)
          .child('questions')
          .child(key)
          .update({ block: true })
      } else {
        fbc.database.public
          .usersRef(userId)
          .child('answers')
          .child(key)
          .update({ block: true })
      }
    }
  }

  approveQ = (reports, key, userId) => {
    const { fbc } = this.props
    if (reports.length && key && userId) {
      reports.forEach(item => {
        fbc.database.private
          .adminableUsersRef(item.userId)
          .child('reports')
          .child(key)
          .update({ block: false, approved: true })
      })
      if (reports[0].isQuestion) {
        fbc.database.public
          .usersRef(userId)
          .child('questions')
          .child(key)
          .update({ block: false })
      } else {
        fbc.database.public
          .usersRef(userId)
          .child('answers')
          .child(key)
          .update({ block: false })
      }
    }
  }

  unBlock = (reports, key, userId) => {
    const { fbc } = this.props
    if (reports.length && key && userId) {
      reports.forEach(item => {
        fbc.database.private
          .adminableUsersRef(item.userId)
          .child('reports')
          .child(key)
          .update({ block: false })
      })
      if (reports[0].isQuestion) {
        fbc.database.public
          .usersRef(userId)
          .child('questions')
          .child(key)
          .update({ block: false })
      } else {
        fbc.database.public
          .usersRef(userId)
          .child('answers')
          .child(key)
          .update({ block: false })
      }
    }
  }

  getUser = task => {
    const user = this.state.allUsers.find(user => user.id === task.userId)
    return user
  }

  getReport = key => this.state.reports[key]

  returnQuestion = key => this.state.questions[key]

  returnContent = (report, key) => {
    const array = Object.values(report)
    if (array[0].isQuestion) {
      return this.state.questions[key]
    }

    const question = this.state.answersByQuestion[array[0].questionId]
    return question[key]
  }

  doDateMath = (date, time) => {
    const minutesAgo = Math.floor((time - date) / (1000 * 60))
    if (minutesAgo < 60) {
      if (minutesAgo === 1) {
        return `${minutesAgo} minute ago`
      }
      if (minutesAgo > 1) {
        return `${minutesAgo} minutes ago`
      }

      return '0 minutes ago'
    }
    if (minutesAgo > 60 && minutesAgo < 1440) {
      const hoursAgo = Math.floor(minutesAgo / 60)
      if (hoursAgo === 1) {
        return `${hoursAgo} hour ago`
      }
      if (hoursAgo > 1) {
        return `${hoursAgo} hours ago`
      }
    } else if (minutesAgo >= 1440) {
      const daysAgo = Math.floor(minutesAgo / 1440)
      if (daysAgo === 1) {
        return `${daysAgo} day ago`
      }
      if (daysAgo > 1) {
        return `${daysAgo} days ago`
      }
    }
  }
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'knowledgeshare',
  (props, fbc) => <App {...props} fbc={fbc} />,
  PureComponent,
)
