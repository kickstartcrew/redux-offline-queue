'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = consumeActionMiddleware;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function consumeActionMiddleware() {
  return function (store) {
    return function (next) {
      return function (action) {
        var shouldConsumeAction = _lodash2.default.get(action, 'consume', false);
        if (shouldConsumeAction) {
          return next({ type: '@@CONSUME@@', payload: _extends({}, action) });
        }
        return next(action);
      };
    };
  };
}