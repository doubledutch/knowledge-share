import React from 'react'

const CustomInputs = ({
  fbc,
  questionPrompt,
  answerPrompt,
  buttonPrompt,
  answerButtonPrompt,
  buttonPromptPlural,
  answerButtonPromptPlural,
}) => {
  return (
    <div className="flexContainer">
      <p className="boxTitle">Custom App Titles</p>
      <p className="headerDesText">
        These options allow you to customize the prompts throughout the app to provide a more
        tailored user experience.
      </p>
      <div className="rowBox">
        <div className="text-editor">
          <p className="text-editor__title">Question Input Prompt</p>
          <div className="text-editor__inputBox">
            <input
              type="text"
              className="text-editor__input"
              value={questionPrompt}
              maxLength={25}
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
              maxLength={25}
              onChange={e => fbc.database.public.adminRef('answerPrompt').set(e.target.value)}
              placeholder="Ex: Add your own answer"
            />
          </div>
        </div>
      </div>
      <div className="rowBox">
        <div className="text-editor">
          <p className="text-editor__title">Submit Question Type</p>
          <p className="text-editor__subTitle">*Note: `Submit` will be auto included for buttons</p>
          <div className="text-editor__inputBox">
            <input
              type="text"
              className="text-editor__input"
              value={buttonPrompt}
              maxLength={10}
              onChange={e => fbc.database.public.adminRef('buttonPrompt').set(e.target.value)}
              placeholder="Ex: Question"
            />
          </div>
        </div>
        <div className="text-editor">
          <p className="text-editor__title">Submit Response Type</p>
          <p className="text-editor__subTitle">*Note: `Submit` will be auto included</p>
          <div className="text-editor__inputBox">
            <input
              type="text"
              className="text-editor__input"
              value={answerButtonPrompt}
              maxLength={10}
              onChange={e => fbc.database.public.adminRef('answerButtonPrompt').set(e.target.value)}
              placeholder="Ex: Answer"
            />
          </div>
        </div>
      </div>
      <div className="rowBox">
        <div className="text-editor">
          <p className="text-editor__title">Plural Submit Question Type</p>
          <p className="text-editor__subTitle">*Note: `My` will be auto included in sorting</p>
          <div className="text-editor__inputBox">
            <input
              type="text"
              className="text-editor__input"
              value={buttonPromptPlural}
              maxLength={10}
              onChange={e => fbc.database.public.adminRef('buttonPromptPlural').set(e.target.value)}
              placeholder="Ex: Question"
            />
          </div>
        </div>
        <div className="text-editor">
          <p className="text-editor__title_space">Plural Submit Response Type</p>
          <div className="text-editor__inputBox">
            <input
              type="text"
              className="text-editor__input"
              value={answerButtonPromptPlural}
              maxLength={10}
              onChange={e =>
                fbc.database.public.adminRef('answerButtonPromptPlural').set(e.target.value)
              }
              placeholder="Ex: Answer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomInputs
