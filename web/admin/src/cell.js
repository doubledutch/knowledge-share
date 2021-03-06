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

import React, { Component } from 'react'
import './App.css'
import client, { translate as t, useStrings } from '@doubledutch/admin-client'
import CustomButtons from './buttons'

export default class CustomCell extends Component {
  constructor() {
    super()
    this.state = {
      isShowingQuestion: false,
      question: '',
    }
  }

  render() {
    return this.renderCell()
  }

  renderButton = report => {
    if (this.state.isShowingQuestion) {
      return report.questionId ? (
        <button className="noBorderButtonSmall" onClick={() => this.hideQuestion()}>
          {t('hide_question')}
        </button>
      ) : null
    }
    return report.questionId ? (
      <button className="noBorderButtonSmall" onClick={() => this.showButton(report.questionId)}>
        {t('view_question')}
      </button>
    ) : null
  }

  renderCell = () => {
    const { currentKey, difference, report, content, singleReport } = this.props
    if (this.state.isShowingQuestion) {
      return (
        <div className="cellContainer">
          <div className="cellBox">
            <div className="cellBoxLeft">
              <div className="cellBoxTop">
                <p className="introText" />
              </div>
              <p className="questionText">"{this.state.question.text}"</p>
              <p className="nameText">
                {this.state.question
                  ? `-${this.state.question.creator.firstName} ${
                      this.state.question.creator.lastName
                    }`
                  : ''}
              </p>
            </div>
          </div>
          <div className="cellBox">
            <div className="cellBoxLeft">
              <div className="cellBoxTop">
                <p className="introText">
                  {this.props.singleReport.isQuestion ? 'Question' : 'Answer'}
                </p>
                {this.renderButton(singleReport)}
              </div>
              <p className="questionText">"{content.text}"</p>
              <div className="cellBoxTop">
                <p className="nameText">
                  {content.creator
                    ? `-${content.creator.firstName} ${content.creator.lastName}`
                    : ''}
                </p>
                {this.returnUsers()}
              </div>
            </div>
            <CustomButtons
              currentUser={content.userId}
              report={report}
              currentKey={currentKey}
              markBlock={this.props.markBlock}
              unBlock={this.props.unBlock}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="cellBox">
        <div className="cellBoxLeft">
          <div className="cellBoxTop">
            <p className="introText">{singleReport.isQuestion ? 'Question' : 'Answer'}</p>
            {this.renderButton(singleReport)}
          </div>
          <p className="questionText">"{content.text}"</p>
          <div className="cellBoxTop">
            <p className="nameText">
              {content.creator ? `-${content.creator.firstName} ${content.creator.lastName}` : null}
            </p>
            {this.returnUsers()}
          </div>
        </div>
        <CustomButtons
          report={report}
          currentKey={currentKey}
          markBlock={this.props.markBlock}
          unBlock={this.props.unBlock}
          currentUser={content.userId}
        />
      </div>
    )
  }

  returnUsers = () => {
    const reports = this.props.report
    let users = ''
    reports.map((item, i) => {
      const user = this.props.getUser(item)
      const name = user ? `${user.firstName} ${user.lastName}` : ''
      users = users + (i > 0 ? ', ' : ' ') + name
    })
    return <p className="nameText">{t('flagged', { users })}</p>
  }

  showButton = currentKey => {
    const question = this.props.returnQuestion(currentKey)
    this.setState({ isShowingQuestion: true, question })
  }

  hideQuestion = () => {
    this.setState({ isShowingQuestion: false })
  }
}
