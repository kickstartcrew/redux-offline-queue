'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getConfig;
/**
 * Default config for the offline queue.
 *
 * @param {String} stateName Redux store key for offline queue state.
 * @param {Array<String>} additionalTriggers An array of action types
 * that will trigger the offline queue to dispatch its actions if possible.
 */
var DEFAULT_CONFIG = {
  stateName: 'offline',
  additionalTriggers: []

  /**
   * Returns a configuration options with passed config or default values.
   *
   * @param {Object} userConfig A config object that can be used to override default values.
   */
};function getConfig() {
  var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _extends({}, DEFAULT_CONFIG, userConfig);
}