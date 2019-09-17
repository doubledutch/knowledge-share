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

import React, { useState } from 'react'
import { translate as t } from '@doubledutch/admin-client'
import AllCustomCell from './AllCustomCell'
import SearchBar from './SearchBar'

const AllQuestionsContainer = ({ fbc, questions, answers }) => {
  const [search, updateSearch] = useState('')

  const filteredQuestions = searchFilter(
    Object.values(questions)
      .map(item => ({ ...item, isQuestion: true }))
      .sort((a, b) => b.lastEdit - a.lastEdit),
    search,
  )

  return (
    <div className="flexContainer">
      <div className="questionBoxWide">
        <p className="boxTitle">{t('all_questions')}</p>
        <div className="cellBoxTop">
          <p className="listTitle">{t('total', { total: filteredQuestions.length })}</p>
          <SearchBar search={search} updateSearch={updateSearch} />
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
          {filteredQuestions.length === 0 && <p className="tableHelpText">No Questions Found</p>}
        </ul>
      </div>
    </div>
  )
}

const searchFilter = (list, search) => {
  if (search.trim()) {
    return list.filter(question => {
      const title = question.text.toLowerCase()
      return title.includes(search.toLowerCase())
    })
  }
  return list
}

export default AllQuestionsContainer
