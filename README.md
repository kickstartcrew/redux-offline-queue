# redux-offline-queue

This package is a simple solution to handling actions or requests with redux while the app is in an offline state by queueing these, and dispatching them once connectivity is established once again.

- [Installation](#installation)
- [Usage](#usage)
- [compatability](#compatability)
- [Additional Configuration](#additional-configuration)

## Installation

`yarn add redux-offline-queue`

OR (old school)

`npm install --save redux-offline-queue`

## Usage

Get up and running in 4 easy steps:

### Step 1: Add the redux-offline-queue reducer to yours

Either import the `{ reducer as offlineQueue }` from `redux-offline-queue` and add it to the `combineReducers` or require it like so (whatever floats your boat):

```javascript
import { combineReducers } from 'redux'

export default combineReducers({
    offlineQueue: require('redux-offline-queue').reducer,
    yourOtherReducer: require('~App/yourOtherReducer').reducer,
})
```

### Step 2: Add the offlineMiddleware

```javascript
import { offlineMiddleware } from 'redux-offline-queue'

const composeStoreWithMiddleware = applyMiddleware(
  offlineMiddleware()
)(createStore)
```

**Note** that this queue is not persisted by itself. One should provide a persistence config by using e.g. `redux-persist` to keep the offline queue persisted.

### Step 3: Declare the actions to be queued

#### With `reduxsauce`

```javascript
import { createReducer, createActions } from 'reduxsauce'
import { markActionsOffline } from 'redux-offline-queue'

const { Types, Creators } = createActions({
    requestBlogs: null,
    createBlog: ['blog'],
})

markActionsOffline(Creators, ['createBlog'])
...
```

#### Without

```javascript
import { markActionsOffline } from 'redux-offline-queue'

const Creators = {
  createBlog: blog => ({
    type: 'CREATE_BLOG',
    blog,
  }),
}

markActionsOffline(Creators, ['createBlog'])
...
```

Last but not least...

### Step 4: Monitor the connectivity and let the library know.

```javascript
import { OFFLINE, ONLINE } from 'redux-offline-queue'

if (appIsConnected) {
    dispatch({ type: ONLINE })
} else {
    dispatch({ type: OFFLINE })
}
```

Works perfect with React Native's `NetInfo`

Inspired by redux-queue-offline(mathieudutour)

Developed by Krzysztof Ciombor

## Compatibility

### with `redux-saga`

If you are using `redux-sagas` for http requests and want to fire your redux actions normally, but suspend(queue) sagas, for Step 2, do the following instead:

```javascript
import { applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import {
  offlineMiddleware,
  suspendSaga,
  consumeActionMiddleware,
} from 'redux-offline-queue'

const middleware = []

middleware.push(offlineMiddleware())
const suspendSagaMiddleware = suspendSaga(createSagaMiddleware())
middleware.push(suspendSagaMiddleware)
middleware.push(consumeActionMiddleware())

applyMiddleware(...middleware)
```

It is **IMPORTANT** that the `consumeActionMiddleware` is placed last, so you can allow the previous middlewares to react first before eventually getting consumed.

## Additional Configuration

Additional configuration can be passed with `offlineMiddleware()`, such as adding additional triggers that will trigger the offline queue to dispatch its actions:

```javascript
...
import { REHYDRATE } from 'redux-persist'

applyMiddleware(offlineMiddleware({
    additionalTriggers: REHYDRATE,
}))
...
```
