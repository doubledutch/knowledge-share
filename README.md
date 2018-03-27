# knowledge-share

A React Native extension for DoubleDutch apps, allowing for users to ask questions and share answers at an event.

DoubleDutch ❤️ React Native. [Get started](https://doubledutch.github.io/rn/)

## Data Model

### Firebase Database

This extension connects to a simple firebase database via
[@doubledutch/firebase-connector](https://www.npmjs.com/package/@doubledutch/firebase-connector)
on a per-event basis.

As the mobile client is the driver for content creation, this is the focus of our data model.

#### `public/users`

Questions, answers, and votes for each are writable by the users that create
them and readable by everyone, so we store them all under `public/users/:userId`
via `fbc.database.public.userRef()`

1. `public/users/:userId/questions`

```json
{
  "abc123": {
    "text": "Where is good to eat around here?",
    "creator": {},
    "dateCreate": 1522097081,
    "block": false,
    "lastEdit": 1522097081
  }
}
```

2. `public/users/:userId/answers`

```json
{
  ":answerId": {
    "text": "Papalote has good burritos",
    "creator": {},
    "dateCreate": 1522097081,
    "block": false,
    "lastEdit": 1522097081,
    "questionId": "abc123"
  }
}
```

3. `public/users/:userId/questionVotes`

```json
{
  ":questionId": true
}
```

4. `public/users/:userId/answerVotes`

```json
{
  ":answerId": true
}
```

### Mobile device

For simplicity, mobile clients download all questions, comments, and votes up
front, with the expectation that a single event will not have too much data that
would make this impractical.

The firebase data is mapped by the client to state:

1. `questions`
2. `answersByQuestion`
3. `votesByQuestion`
4. `votesByAnswer`

#### Mobile client state

The mobile client side is critical for organizing and associating the objects. An example method is found below:

```
fbc.database.public.allRef('comments').on('child_added', data => {
        this.setState(state => {
          const comment = data.val()
          const commentsForQuestion = this.state.comments[comment.questionId]
          if (commentsForQuestion) {
            var newCommentsForQuestion = [...commentsForQuestion, {...comment, key: data.key}]
          } else {
            var newCommentsForQuestion = [{...comment, key: data.key}]
          }
          return {comments: {...state.comments, [comment.questionId]: newCommentsForQuestion}}
        })
      })
```

Here we are organizing comments via the question key. This ensures that we can effictely organize comments even if data for the questions has not been downloaded. It also allows us to quickly find the correct comments to display for each question.
