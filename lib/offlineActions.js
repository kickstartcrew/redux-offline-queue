'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createOfflineActions = createOfflineActions;
exports.markActionsOffline = markActionsOffline;

var _reduxsauce = require('reduxsauce');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wraps reduxsauce's creator function to append offline metadata.
 *
 * @param {Function} creator Reduxsauce's creator function.
 */
var appendOfflineMeta = function appendOfflineMeta(creator) {
  return function () {
    var creatorResult = creator.apply(undefined, arguments);
    return _extends({}, creatorResult, {
      meta: {
        queueIfOffline: true
      }
    });
  };
};

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
function createOfflineActions(config) {
  var _createActions = (0, _reduxsauce.createActions)(config),
      Types = _createActions.Types,
      Creators = _createActions.Creators;

  var OfflineCreators = _lodash2.default.mapValues(Creators, function (creator) {
    return appendOfflineMeta(creator);
  });

  return {
    Types: Types,
    Creators: OfflineCreators
  };
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
function markActionsOffline(creators, offlineActions) {
  _lodash2.default.forEach(offlineActions, function (offlineAction) {
    if (_lodash2.default.has(creators, offlineAction)) {
      // eslint-disable-next-line no-param-reassign
      creators[offlineAction] = appendOfflineMeta(creators[offlineAction]);
    }
  });
}