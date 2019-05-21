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

import React, { Component } from 'react'
import './App.css'
import { translate as t } from '@doubledutch/admin-client'
import checkocircle from './icons/checkocircle.svg'
import deleteocircle from './icons/deleteocircle.svg'

const AllQuestionsContainer = ({ content, responses, fbc }) => {
  return (
    <div className="verticalBox">
      <Cell content={content} fbc={fbc} isQuestion />
      {responses.map(item => (
        <Cell content={item} fbc={fbc} />
      ))}
    </div>
  )
}

const Cell = ({ content, isQuestion, fbc }) => {
  return (
    <div className={isQuestion ? 'cellBox' : 'cellBoxPadded'}>
      <div className="cellBoxLeft">
        <div className="cellBoxTop">
          <p className="introText">{isQuestion ? t('question') : t('answer')}</p>
          {content.block && <p className="blockedText">{t('blocked_bold')}</p>}
        </div>
        <p className="questionText">"{content.text}"</p>
        <div className="cellBoxTop">
          <p className="nameText">
            {content.creator ? `-${content.creator.firstName} ${content.creator.lastName}` : null}
          </p>
        </div>
      </div>
      <span className="cellBoxRight">
        <img className="button1" onClick={() => unBlock(content)} src={checkocircle} alt="check" />
        <img
          className="button1"
          onClick={() => markBlock(content)}
          src={deleteocircle}
          alt="block"
        />
      </span>
    </div>
  )

  function markBlock(content) {
    fbc.database.public
      .usersRef(content.userId)
      .child(content.isQuestion ? 'questions' : 'answers')
      .child(content.id)
      .update({ block: true })
  }

  function unBlock(content) {
    fbc.database.public
      .usersRef(content.userId)
      .child(content.isQuestion ? 'questions' : 'answers')
      .child(content.id)
      .update({ block: false })
  }
}

export default AllQuestionsContainer
