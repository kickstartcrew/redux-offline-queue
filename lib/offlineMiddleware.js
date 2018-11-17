'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = offlineMiddleware;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _initialState = require('./initialState');

var _initialState2 = _interopRequireDefault(_initialState);

var _actions = require('./actions');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  queue.forEach(function (actionInQueue) {
    dispatch(_extends({}, actionInQueue, {
      consume: true,
      meta: {
        queueIfOffline: false
      }
    }));
  });
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
function offlineMiddleware() {
  var userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (_ref) {
    var getState = _ref.getState,
        dispatch = _ref.dispatch;
    return function (next) {
      return function (action) {
        var config = (0, _config2.default)(userConfig);
        var stateName = config.stateName,
            additionalTriggers = config.additionalTriggers;


        var state = _lodash2.default.get(getState(), stateName, _initialState2.default);

        var isConnected = state.isConnected;


        if (action.type === _actions.ONLINE || _lodash2.default.includes(additionalTriggers, action.type)) {
          var result = next(action);

          var _$get = _lodash2.default.get(getState(), stateName),
              queue = _$get.queue;

          var canFireQueue = isConnected || action.type === _actions.ONLINE;
          if (canFireQueue) {
            fireQueuedActions(queue, dispatch);
            dispatch({ type: _actions.RESET_QUEUE });
          }
          return result;
        }

        var shouldQueue = _lodash2.default.get(action, ['meta', 'queueIfOffline'], false);

        if (isConnected || !shouldQueue) {
          return next(action);
        }

        var actionToQueue = {
          type: _actions.QUEUE_ACTION,
          payload: _extends({}, action)
        };

        dispatch(actionToQueue);

        var skipSagaAction = _extends({}, action, {
          skipSaga: true
        });

        return next(skipSagaAction);
      };
    };
  };
}