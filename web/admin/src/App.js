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
  mapPerUserPushedDataToStateObjects,
  mapPerUserPushedDataToObjectOfStateObjects,
  reducePerUserDataToStateCount,
  mapPerUserPrivatePushedDataToObjectOfStateObjects,
  mapPerUserPrivatePushedDataToStateObjects
} from './firebaseHelpersJS'
import CustomButtons from './buttons'
import CustomCell from './cell'
import { Z_DEFAULT_COMPRESSION } from 'zlib';
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
    questionKey: ''
  }
    this.signin = fbc.signinAdmin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  

  componentDidMount() {
    this.signin.then(() => {
      client.getUsers().then(users => {
        this.setState({allUsers: users})
        mapPerUserPushedDataToStateObjects(fbc, 'questions', this, 'questions', (userId, key, value) => key)
        mapPerUserPushedDataToObjectOfStateObjects(fbc, 'answers', this, 'answersByQuestion', (userId, key, value) => value.questionId, (userId, key, value) => key)
        mapPerUserPrivatePushedDataToStateObjects(fbc, 'reports', this, 'reports', (userId, key, value) => key)
      })  
    })
  }

  render() {
    const content = Object.keys(this.state.reports)
    const contentVal = Object.values(this.state.reports)
    const flagged = contentVal.filter(item => item.block === false)
    const blocked = contentVal.filter(item => item.block === true)
    const time = new Date().getTime()

    console.log(this.state.reports)

    return (
      <div>
        <p className='bigBoxTitle'>Knowledge Share</p>
        <div className="App">
          <div className="questionBox">
            <div className="cellBoxTop">
              <p className="listTitle">Flagged ({flagged.length || 0})</p>
              <button className="noBorderButton" onClick={() => this.hideQuestion()}>Block All</button>
            </div>
            <ul className='listBox'>
              { content.map((task, i) => {
                const report = this.getReport(task)
                const content = this.returnContent(report, task)
                if (report.block === false) {
                  return (
                    <li className='cellBox' key={i}>
                      <CustomCell
                        currentKey = {task}
                        returnQuestion={this.returnQuestion}
                        returnContent={this.returnContent}
                        markBlock={this.markBlock}
                        unBlock={this.unBlock}
                        getUser={this.getUser}
                        report = {report}
                        time = {time}
                        dateMath={this.doDateMath}
                        content = {content}
                      />
                    </li>
                )
              }
              }) }
            </ul>
          </div>
          <div className="questionBox">
            <span>
              <p className="listTitle">Blocked ({blocked.length || 0})</p>
            </span>
            <ul className='listBox'>
              { content.map((task, i) => {
                const report = this.getReport(task)
                const content = this.returnContent(report, task)
                if (report.block === true) {
                  return (
                    <li key={i}>
                      <CustomCell
                        currentKey = {task}
                        report={report}
                        returnQuestion={this.returnQuestion}
                        returnContent={this.returnContent}
                        unBlock={this.unBlock}
                        getUser={this.getUser}
                        getReport={this.getReport}
                        location = {i}
                        time = {time}
                        dateMath={this.doDateMath}
                        content={content}
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

  markBlock = (task, key) => {
    if (task.isQuestion) {
      fbc.database.private.adminableUsersRef(task.userId).child("reports").child(key).update({block: true})
      fbc.database.public.usersRef(task.userId).child("questions").child(key).update({block: true})
    }
    else {
      fbc.database.private.adminableUsersRef(task.userId).child("reports").child(key).update({block: true})
      fbc.database.public.usersRef(task.userId).child("answers").child(key).update({block: true})
    }
  }

  unBlock = (task, key) => {
    if (task.isQuestion) {
      fbc.database.private.adminableUsersRef(task.userId).child("report").child(key).update({block: false, approved: true})
      fbc.database.public.usersRef(task.userId).child("questions").child(key).update({block: false})
    }
    else {
      fbc.database.private.adminableUsersRef(task.userId).child("reports").child(key).update({block: false, approved: true})
      fbc.database.public.usersRef(task.userId).child("answers").child(key).update({block: false})
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

  returnContent = (task, key) => {
    if (task.isQuestion) {
      return this.state.questions[key]
    }
    else {
      const question = this.state.answersByQuestion[task.questionId]
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
