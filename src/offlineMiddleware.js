import {
  includes as _includes,
  get as _get,
} from 'lodash'

import INITIAL_STATE from './initialState'
import { QUEUE_ACTION, ONLINE, RESET_QUEUE } from './actions'
import getConfig from './config'

/**
 * Helper method to dispatch the queued action again when the connection is available.
 *
 * It will modify the original action by adding:
 * ```
 * consume: true
 * ```
 * to skip firing the reducer
 * and:
 * ```
 * meta: {
 *   queueIfOffline: false
 * }
 * ```
 * to avoid putting it back to the queue.
 *
 * @param {Array} queue An array of queued Redux actions.
 * @param {Function} dispatch Redux's dispatch function.
 */
function fireQueuedActions(queue, dispatch) {
  queue.forEach((actionInQueue) => {
    dispatch({
      ...actionInQueue,
      consume: true,
      meta: {
        queueIfOffline: false,
      },
    })
  })
}

/**
 * Custom Redux middleware for providing an offline queue functionality.
 *
 * Every action that should be queued if the device is offline should have:
 * ```
 * meta: {
 *   queueIfOffline: true
 * }
 * ```
 * property set.
 *
 * When the device is online this just passes the action to the next middleware as is.
 *
 * When the device is offline this action will be placed in an offline queue.
 * Those actions are later dispatched again when the device comes online.
 * Note that this action is still dispatched to make the optimistic updates possible.
 * However it wil have `skipSaga: true` property set
 * for the `suspendSaga` wrapper to skip the corresponding saga.
 *
 * Note that this queue is not persisted by itself.
 * One should provide a persistence config by using e.g.
 * `redux-persist` to keep the offline queue persisted.
 *
 * @param {Object} userConfig See: config.js for the configuration options.
 */
export default function offlineMiddleware(userConfig = {}) {
  return ({ getState, dispatch }) => next => (action) => {
    const config = getConfig(userConfig)
    const { stateName, additionalTriggers } = config

    const state = _get(getState(), stateName, INITIAL_STATE)

    const { isConnected } = state

    if (action.type === ONLINE || _includes(additionalTriggers, action.type)) {
      const result = next(action)
      const { queue } = _get(getState(), stateName)
      const canFireQueue = isConnected || action.type === ONLINE
      if (canFireQueue) {
        fireQueuedActions(queue, dispatch)
        dispatch({ type: RESET_QUEUE })
      }
      return result
    }

    const shouldQueue = _get(action, ['meta', 'queueIfOffline'], false)

    if (isConnected || !shouldQueue) {
      return next(action)
    }

    const actionToQueue = {
      type: QUEUE_ACTION,
      payload: {
        ...action,
      },
    }

    dispatch(actionToQueue)

    const skipSagaAction = {
      ...action,
      skipSaga: true,
    }

    return next(skipSagaAction)
  }
}
