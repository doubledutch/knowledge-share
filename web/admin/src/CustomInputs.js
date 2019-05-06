import React from 'react'

const CustomInputs = ({ fbc, questionPrompt, answerPrompt, buttonPrompt, answerButtonPrompt }) => {
  return (
    <div className="flexContainer">
      <p className="boxTitle">Custom App Titles</p>
      <div className="rowBox">
        <div className="text-editor">
          <p className="text-editor__title">Question Input Prompt</p>
          <div className="text-editor__inputBox">
            <input
              type="text"
              className="text-editor__input"
              value={questionPrompt}
              onChange={e => fbc.database.public.adminRef('questionPrompt').set(e.target.value)}
              placeholder="Ex: What is your question?"
            />
          </div>
        </div>
        <div className="text-editor">
          <p className="text-editor__title">Question Response Input Prompt</p>
          <div className="text-editor__inputBox">
            <input
              type="text"
              className="text-editor__input"
              value={answerPrompt}
              onChange={e => fbc.database.public.adminRef('answerPrompt').set(e.target.value)}
              placeholder="Ex: Add your own answer"
            />
          </div>
        </div>
      </div>
      <div className="rowBox">
        <div className="text-editor">
          <p className="text-editor__title">Submit Question Type</p>
          <div className="text-editor__inputBox">
            <input
              type="text"
              className="text-editor__input"
              value={buttonPrompt}
              onChange={e => fbc.database.public.adminRef('buttonPrompt').set(e.target.value)}
              placeholder="Ex: Question Note: `Submit` will be auto included"
            />
          </div>
        </div>
        <div className="text-editor">
          <p className="text-editor__title">Submit Response Type</p>
          <div className="text-editor__inputBox">
            <input
              type="text"
              className="text-editor__input"
              value={answerButtonPrompt}
              onChange={e => fbc.database.public.adminRef('answerButtonPrompt').set(e.target.value)}
              placeholder="Ex: Answer Note: `Submit` will be auto included"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomInputs
