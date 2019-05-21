/*
 * Copyright 2019 DoubleDutch, Inc.
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

import React from 'react'
import client, { translate as t, useStrings } from '@doubledutch/admin-client'
import AllCustomCell from './AllCustomCell'

const AllQuestionsContainer = ({ fbc, questions, answers }) => {
  const filteredQuestions = Object.values(questions)
    .map(item => ({ ...item, isQuestion: true }))
    .sort((a, b) => b.dateCreate - a.dateCreate)
  return (
    <div className="flexContainer">
      <div className="questionBoxWide">
        <p className="boxTitle">{t('all_questions')}</p>
        <div className="cellBoxTop">
          <p className="listTitle">{t('total', { total: filteredQuestions.length })}</p>
        </div>
        <ul className="listBox">
          {filteredQuestions.map(content => {
            return (
              <li className="cellBox" key={content.id}>
                <AllCustomCell
                  content={content}
                  responses={Object.values(answers[content.id] || {})}
                  fbc={fbc}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default AllQuestionsContainer
