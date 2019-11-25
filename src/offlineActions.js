import { createActions } from 'reduxsauce'
import {
  mapValues as _mapValues,
  forEach as _forEach,
  has as _has,
} from 'lodash'

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
        ...creatorResult.meta
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
