import { REHYDRATE } from 'redux-persist'

import INITIAL_STATE from './initialState'
import {
  QUEUE_ACTION,
  ONLINE,
  OFFLINE,
  RESET_QUEUE,
  REMOVE_ACTION,
} from './actions'

/**
 * Reducer for the offline queue.
 *
 * @param {Object} state Offline queue Redux store state.
 * @param {Object} action Action that was dispatched to the store.
 */
export default function reducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case REHYDRATE: {
      // Handle rehydrating with custom shallow merge.
      if (action.payload && action.payload.offline) {
        return { ...state, ...action.payload.offline }
      }

      return state
    }
    case QUEUE_ACTION:
      return { ...state, queue: state.queue.concat(action.payload) }
    case ONLINE:
      return { ...state, isConnected: true }
    case OFFLINE:
      return { ...state, isConnected: false }
    case REMOVE_ACTION: {
      if (action.payload.uuid) {
        const filteredQueue = state.queue.filter(queuedAction => queuedAction.meta.uuid !== action.payload.uuid)
        return { ...state, queue: [...filteredQueue] }
      }
    }
    case RESET_QUEUE:
      return { ...state, queue: [] }
    default:
      return state
  }
}
