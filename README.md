# knowledge-share

A React Native extension for DoubleDutch apps, allowing for users to ask questions and share answers at an event.

DoubleDutch ❤️ React Native. [Get started](https://doubledutch.github.io/rn/)

## Data Model

### Firebase Database

This extension connects to a simple firebase database via
[@doubledutch/firebase-connector](https://www.npmjs.com/package/@doubledutch/firebase-connector)
on a per-event basis.

#### `public/all`

### Mobile client state

As the mobile client is the driver for content creation this is the focus of our data model. As this application requires an open sharing of commentary we are storing everything as public which enables visibility by all.

We have 3 principals data types to power this application:
- **`public/all/questions`**: Original questions asked
- **`public/all/comments`**: The commentary on those questions
- **`public/all/votes`**: Any votes associated to those questions or comments.

All data is stored independently and associated on the mobile device via its parent object key.

With questions as the first data type in any tree we do not need to worry about its association with other objects.

```
  .key: {
      text: questionName,
      creator: client.currentUser,
      comments: [],
      dateCreate: time,
      block: false,
      lastEdit: time
    } 
```

To track comments since they are created from the questions details screen we can easily track them via the original questions key.

```
  .key: {
        text: questionName,
        creator: client.currentUser,
        comments: [],
        dateCreate: time,
        block: false,
        lastEdit: time,
        questionId: this.state.question.key
    } 
```

To track votes we use a similar method of associated them via the parent objects key.      

``` .key: {
        user: client.currentUser.id,
        commentKey: c.key,
        value: 1
    } 
```

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
