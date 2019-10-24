import { get as _get } from 'lodash'

/**
 * Custom middleware that can consume the action before it can reach the reducer.
 *
 * This is useful when we want to optimistically update the local state,
 * but the same action will be dispatched again when it is fired from the offline queue.
 * To avoid updating the state again we change its type to one no reducer reacts to.
 *
 * For the action to be consumed it should have:
 * ```
 * consume: true
 * ```
 * property set.
 *
 * Note: For this to work correctly it should be placed as the last middleware in the chain.
 * For example, we do want the saga or logger to react to this action.
 */
export default function consumeActionMiddleware() {
  return store => next => (action) => {
    const shouldConsumeAction = _get(action, 'consume', false)
    if (shouldConsumeAction) {
      return next({ type: '@@CONSUME@@', payload: { ...action } })
    }
    return next(action)
  }
}
