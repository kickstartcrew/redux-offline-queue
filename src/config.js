/**
 * Default config for the offline queue.
 *
 * @param {String} stateName Redux store key for offline queue state.
 * @param {Array<String>} additionalTriggers An array of action types
 * that will trigger the offline queue to dispatch its actions if possible.
 * @param {Boolean} dontDispatchActionAfterQueue If this is true an action
 * that is queued will NOT dispatch instantly or go to the next middleware.
 */
const DEFAULT_CONFIG = {
  stateName: 'offline',
  additionalTriggers: [],
  dontDispatchActionAfterQueue: false,
}

/**
 * Returns a configuration options with passed config or default values.
 *
 * @param {Object} userConfig A config object that can be used to override default values.
 */
export default function getConfig(userConfig = {}) {
  return { ...DEFAULT_CONFIG, ...userConfig }
}
