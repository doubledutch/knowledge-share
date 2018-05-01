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
import client from '@doubledutch/admin-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
import {
  mapPerUserPublicPushedDataToStateObjects,
  mapPerUserPublicPushedDataToObjectOfStateObjects,
  mapPerUserPrivateAdminablePushedDataToStateObjects,
  mapPerUserPrivateAdminablePushedDataToObjectOfStateObjects
} from '@doubledutch/firebase-connector'
import CustomButtons from './buttons'
import CustomCell from './cell'
const fbc = FirebaseConnector(client, 'knowledgeshare')
fbc.initializeAppWithSimpleBackend()

export default class App extends Component {
  constructor() {
    super()
    this.state = { reports: {},
    allUsers: [],
    reportedQuestions: [],
    blockedQuestions: [],
    questions: {},
    answersByQuestion: {},
    reportComments: {},
    location: 0,
    questionKey: '',
    totalFlagged: 0,
    totalBlocked: 0
  }
    this.signin = fbc.signinAdmin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  

  componentDidMount() {
    this.signin.then(() => {
      client.getUsers().then(users => {
        this.setState({allUsers: users})
        mapPerUserPublicPushedDataToStateObjects(fbc, 'questions', this, 'questions', (userId, key, value) => key)
        mapPerUserPublicPushedDataToObjectOfStateObjects(fbc, 'answers', this, 'answersByQuestion', (userId, key, value) => value.questionId, (userId, key, value) => key)
        mapPerUserPrivateAdminablePushedDataToObjectOfStateObjects(fbc, 'reports', this, 'reports', (userId, key, value) => key, (userId) => userId)
      })  
    })
  }

  render() {
    const content = Object.keys(this.state.reports)
    const time = new Date().getTime()
    return (
      <div>
        <p className='bigBoxTitle'>Knowledge Share</p>
        <div className="App">
          <div className="questionBox">
            <div className="cellBoxTop">
              <p className="listTitle">Reported ({(this.flaggedList ? this.flaggedList.children.length : "0")})</p>
              <button className="noBorderButton" onClick={() => this.approveAll(content)}>Approve All</button>
              <button className="noBorderButton" onClick={() => this.blockAll(content)}>Block All</button>
            </div>
            <ul className='listBox' ref={(input) => {this.flaggedList = input}}>
              { content.map((task, i) => {
                const report = this.getReport(task)
                const allReportsFlagged = Object.values(report).filter(item => item.block !== true && item.approved !== true)
                const current = this.returnContent(report, task)
                const questionUser = this.getUser(task)
                if (allReportsFlagged.length) {
                  return (
                    <li className='cellBox' key={i}>
                      <CustomCell
                        currentKey = {task}
                        returnQuestion={this.returnQuestion}
                        returnContent={this.returnContent}
                        markBlock={this.markBlock}
                        unBlock={this.approveQ}
                        getUser={this.getUser}
                        report = {allReportsFlagged}
                        time = {time}
                        dateMath={this.doDateMath}
                        content = {current}
                        singleReport = {allReportsFlagged[0]}
                        allReportsFlagged = {allReportsFlagged}
                      />
                    </li>
                  )
                }
              }) }
            </ul>
          </div>
          
          <div className="questionBox">
            <span>
            <p className="listTitle">Blocked ({(this.blockedList ? this.blockedList.children.length : "0")})</p>
            </span>
            <ul className='listBox' ref={(input) => {this.blockedList = input}}>
              { content.map((task, i) => {
                const report = this.getReport(task)
                const current = this.returnContent(report, task)
                const allReportsBlocked = Object.values(report).filter(item => item.block === true && item.approved !== true)
                if (allReportsBlocked.length) {
                  return (
                    <li key={i}>
                      <CustomCell
                        currentKey = {task}
                        report={allReportsBlocked}
                        singleReport = {allReportsBlocked[0]}
                        returnQuestion={this.returnQuestion}
                        returnContent={this.returnContent}
                        unBlock={this.unBlock}
                        getUser={this.getUser}
                        getReport={this.getReport}
                        location = {i}
                        time = {time}
                        dateMath={this.doDateMath}
                        content={current}
                      />
                    </li>
                  )
                }
              }) }
            </ul>
          </div>
        </div>
      </div>
    )
  }

  blockAll = (content) => {
    content.map((item, i) => {
      const currentKey = item
      const report = this.getReport(item)
      const content = this.returnContent(report, item)
      const allReportsFlagged = Object.values(report).filter(item => item.block !== true && item.approved !== true)
      this.markBlock(allReportsFlagged, currentKey, content.userId)
    })
  }


  renderMessage = () => {
    return (
      <div className="modTextBox">
        <p className="bigModText">Moderation is turned off</p>
        <p className="smallModText">All submitted questions will appear in the</p>
        <p className="smallModText">approved questions list</p>
      </div>
    )
  }



  approveAll = (content) => {
    content.map((item, i) => {
      const currentKey = item
      const report = this.getReport(item)
      const content = this.returnContent(report, item)
      const allReportsFlagged = Object.values(report).filter(item => item.block !== true && item.approved !== true)
      this.unBlock(allReportsFlagged, currentKey, content.userId)
    })
  }

  markBlock = (reports, key, userId) => {
    if (reports.length) {
      reports.map((item) => {
        fbc.database.private.adminableUsersRef(userId).child("reports").child(key).update({block: true})
      })
      if (reports[0].isQuestion) {
        fbc.database.public.usersRef(userId).child("questions").child(key).update({block: true})
      }
      else {
        fbc.database.public.usersRef(userId).child("answers").child(key).update({block: true})
      }
    }
  }

  approveQ = (reports, key, userId) => {
    if (reports.length) {
      reports.map((item) => {
        fbc.database.private.adminableUsersRef(item.userId).child("reports").child(key).update({block: false, approved: true})
      })
      if (reports[0].isQuestion) {
        fbc.database.public.usersRef(userId).child("questions").child(key).update({block: false})
      }
      else {
        fbc.database.public.usersRef(userId).child("answers").child(key).update({block: false})
      }
    }
  }

  unBlock = (reports, key, userId) => {
    if (reports.length) {
      reports.map((item) => {
        fbc.database.private.adminableUsersRef(item.userId).child("reports").child(key).update({block: false})
      })
      if (reports[0].isQuestion) {
        fbc.database.public.usersRef(userId).child("questions").child(key).update({block: false})
      }
      else {
        fbc.database.public.usersRef(userId).child("answers").child(key).update({block: false})
      }
    }
  }

  getUser = (task) => {
    const user = this.state.allUsers.find(user => user.id === task.userId)
    return user
  }

  getReport = (key) => {
    return this.state.reports[key]
  }

  returnQuestion = (key) => {
    return this.state.questions[key]
  }

  returnContent = (report, key) => {
    const array = Object.values(report)
    if (array[0].isQuestion) {
      return this.state.questions[key]
    }
    else {
      const question = this.state.answersByQuestion[array[0].questionId]
      return question[key]
    }
  }

  doDateMath = (date, time) => {
    const minutesAgo = Math.floor((time - date) / (1000*60))
    if (minutesAgo < 60) {
      if (minutesAgo === 1) {
        return minutesAgo + " minute ago"
      }
      if (minutesAgo > 1) {
        return minutesAgo + " minutes ago"
      }
      else {
        return "0 minutes ago"
      }
    } else if (minutesAgo > 60 && minutesAgo < 1440) {
      const hoursAgo = Math.floor(minutesAgo / 60) 
      if (hoursAgo === 1) {
        return hoursAgo + " hour ago"
      }
      if (hoursAgo > 1) {
        return hoursAgo + " hours ago"
      }
    } else if (minutesAgo >= 1440) {
      const daysAgo = Math.floor(minutesAgo / 1440) 
      if (daysAgo === 1) {
        return daysAgo + " day ago"
      }
      if (daysAgo > 1) {
        return daysAgo + " days ago"
      }
    }
  }
}
