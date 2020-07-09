import { createActions } from 'reduxsauce'
import {
  mapValues as _mapValues,
  forEach as _forEach,
  has as _has,
} from 'lodash'
import uuid from 'uuid/v4'

import { QUEUE_ACTION, REMOVE_ACTION } from "./actions"

/**
 * Wraps reduxsauce's creator function to append offline metadata.
 *
 * @param {Function} creator Reduxsauce's creator function.
 */
const appendOfflineMeta = (creator) => {
  return (...rest) => {
    const creatorResult = creator(...rest)

    return {
      ...creatorResult,
      meta: {
        uuid: uuid(),
        ...creatorResult.meta,
        queueIfOffline: true,
      },
    }
  }
}

/**
 * Custom wrapper around reduxsauce's `createActions` that automatically appends
 * offline meta required by offline queue.
 *
 * Sample usage:
 * ```
 * const { Types: OfflineTypes, Creators: OfflineCreators } = createOfflineActions({
 *   updateUser: ['userId'],
 * })
 * ```
 *
 * @param {Object} config Reduxsauce configuration object with action definitions.
 */
export function createOfflineActions(config) {
  const { Types, Creators } = createActions(config)

  const OfflineCreators = _mapValues(Creators, (creator) => {
    return appendOfflineMeta(creator)
  })

  return {
    Types,
    Creators: OfflineCreators,
  }
}

/**
 * Provides an alternative way to mark an action as offline action.
 *
 * Modifies given action creators object
 * by appending offline meta to specified action names.
 *
 * This is useful as it does not require merging back Creators and OfflineCreators.
 *
 * @param {Object} creators Reduxsauce's action creators.
 * @param {Array} offlineActions An array of action names.
 */
export function markActionsOffline(creators, offlineActions) {
  _forEach(offlineActions, (offlineAction) => {
    if (_has(creators, offlineAction)) {
      // eslint-disable-next-line no-param-reassign
      creators[offlineAction] = appendOfflineMeta(creators[offlineAction])
    }
  })
}

/**
 * Provides an object with the action type that is utilized to queue request actions.
 * The action provided should include a type and the payload.
 *
 * @param {Object} action An action that needs to be queued.
 */
export const queueAction = (action) => {
  return {
    type: QUEUE_ACTION,
    payload: {
      ...action,
      meta: {
        uuid: uuid(),
        ...action.meta,
      },
    }
  }
}

export const removeAction = (action) => {
  return {
    type: REMOVE_ACTION,
    payload: {
      uuid: action.uuid,
    }
  }
}
