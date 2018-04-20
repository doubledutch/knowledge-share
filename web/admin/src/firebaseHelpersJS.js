
// Turns firebase objects {...value} with paths `/public/users/:userId/:userRefKey/:keyInUserData`
// into state at [stateKey]: { [key]: {...value, userId, id: key} }
// where key = keyFn(userId, keyInUserData, value)
export function mapPerUserPushedDataToStateObjects(fbc, userRefKey, component, stateKey,
    keyFn /* (userId, keyInUserData, valueInUserData) => key */) {
  convertPerUserDataToState(fbc, userRefKey, component, stateKey, keyFn,
    (newState, userId, key) => delete newState[key],
    (newState, userId, key, value, keyInUserData) => newState[key] = {...value, userId, id: key})
}

// Turns firebase objects {...value} with paths `/public/users/:userId/:userRefKey/:keyInUserData`
// into state at [stateKey]: { [key]: {[subKey]: {...value, userId, key} } }
// where key =    keyFn(userId, keyInUserData, value)
// and   subKey = subKeyFn(userId, key, value)
export function mapPerUserPushedDataToObjectOfStateObjects(fbc, userRefKey, component, stateKey,
    keyFn /* (userId, keyInUserData, valueInUserData) => key */,
    subKeyFn /* (userId, keyInUserData, valueInUserData) => subKey */) {
  convertPerUserDataToState(fbc, userRefKey, component, stateKey, keyFn,
    (newState, userId, key) => delete newState[key],
    (newState, userId, key, value, keyInUserData) => {
      const subKey = subKeyFn(userId, keyInUserData, value)
      const subValue = {...value, userId, id: subKey}
      newState[key] = {...(newState[key] || {}), [subKey]: subValue}
    })
}

// Turns firebase objects {...value} with paths `/public/users/:userId/:userRefKey/:keyInUserData`
// into state at [stateKey]: { [key]: count }
// where key =   keyFn(userId, keyInUserData, value)
// and   count = the number of objects from all users with [key]
export function reducePerUserDataToStateCount(fbc, userRefKey, component, stateKey,
    keyFn /* (userId, keyInUserData, valueInUserData) => key */) {
  convertPerUserDataToState(fbc, userRefKey, component, stateKey, keyFn,
    (newState, userId, key) => newState[key] = (newState[key] || 0) - 1,
    (newState, userId, key, value, keyInUserData) => newState[key] = (newState[key] || 0) + 1)
}

export function convertPerUserDataToState(fbc, userRefKey, component, stateKey, keyFn, stateDestroyer, stateCreator) {
  const ref = fbc.database.public.usersRef()
  const keysByUserId = {}

  ref.on('child_added', onUserData)
  ref.on('child_changed', onUserData)
  ref.on('child_removed', data => onUserData({ key: data.key, val: ()=>({}) }))

  function onUserData(data) {
    const userId = data.key
    const userData = (data.val() || {})[userRefKey] || {}
    component.setState(state => {
      const stateForKey = state[stateKey]
      const newStateForKey = {...stateForKey}

      // Remove old data for the user
      const oldKeysForUser = (keysByUserId[userId] || [])
      oldKeysForUser.forEach(key => {
        try {
          stateDestroyer(newStateForKey, userId, key)
        } catch (e) {
          console.error(e)
        }
      })

      // Add current data for the user
      const newKeysForUser = []
      Object.keys(userData).forEach(keyInUserData => {
        try {
          const value = userData[keyInUserData]
          const key = keyFn(userId, keyInUserData, value)
          newKeysForUser.push(key)
          stateCreator(newStateForKey, userId, key, value, keyInUserData)
        } catch (e) {
          console.error(e)
        }
      })

      keysByUserId[userId] = newKeysForUser
      
      return {[stateKey]: newStateForKey}
    })
  }
}

export function mapPerUserPrivatePushedDataToStateObjects(fbc, userRefKey, component, stateKey,
  keyFn /* (userId, keyInUserData, valueInUserData) => key */) {
convertPrivatePerUserDataToState(fbc, userRefKey, component, stateKey, keyFn,
  (newState, userId, key) => delete newState[key],
  (newState, userId, key, value, keyInUserData) => newState[key] = {...value, userId, id: key})
}

export function mapPerUserPrivatePushedDataToObjectOfStateObjects(fbc, userRefKey, component, stateKey,
  keyFn /* (userId, keyInUserData, valueInUserData) => key */,
  subKeyFn /* (userId, keyInUserData, valueInUserData) => subKey */) {
convertPrivatePerUserDataToState(fbc, userRefKey, component, stateKey, keyFn,
  (newState, userId, key) => delete newState[key],
  (newState, userId, key, value, keyInUserData) => {
    const subKey = subKeyFn(userId, keyInUserData, value)
    const subValue = {...value, userId, id: subKey}
    newState[key] = {...(newState[key] || {}), [subKey]: subValue}
  })
}

export function convertPrivatePerUserDataToState(fbc, userRefKey, component, stateKey, keyFn, stateDestroyer, stateCreator) {
  const ref = fbc.database.private.adminableUsersRef()
  const keysByUserId = {}

  ref.on('child_added', onUserData)
  ref.on('child_changed', onUserData)
  ref.on('child_removed', data => onUserData({ key: data.key, val: ()=>({}) }))

  function onUserData(data) {
    const userId = data.key
    const userData = (data.val() || {})[userRefKey] || {}
    component.setState(state => {
      const stateForKey = state[stateKey]
      const newStateForKey = {...stateForKey}

      // Remove old data for the user
      const oldKeysForUser = (keysByUserId[userId] || [])
      oldKeysForUser.forEach(key => {
        try {
          stateDestroyer(newStateForKey, userId, key)
        } catch (e) {
          console.error(e)
        }
      })

      // Add current data for the user
      const newKeysForUser = []
      Object.keys(userData).forEach(keyInUserData => {
        try {
          const value = userData[keyInUserData]
          const key = keyFn(userId, keyInUserData, value)
          newKeysForUser.push(key)
          stateCreator(newStateForKey, userId, key, value, keyInUserData)
        } catch (e) {
          console.error(e)
        }
      })

      keysByUserId[userId] = newKeysForUser
      
      return {[stateKey]: newStateForKey}
    })
  }
}
