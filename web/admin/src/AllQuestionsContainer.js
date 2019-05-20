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
