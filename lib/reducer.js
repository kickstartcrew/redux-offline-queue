'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;

var _reduxPersist = require('redux-persist');

var _initialState = require('./initialState');

var _initialState2 = _interopRequireDefault(_initialState);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reducer for the offline queue.
 *
 * @param {Object} state Offline queue Redux store state.
 * @param {Object} action Action that was dispatched to the store.
 */
function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _initialState2.default;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    switch (action.type) {
        case _reduxPersist.REHYDRATE:
            {
                // Handle rehydrating with custom shallow merge.
                return action.payload && action.payload.offline ? _extends({}, state, action.payload.offline) : state;
            }
        case _actions.QUEUE_ACTION:
            return _extends({}, state, { queue: state.queue.concat(action.payload) });
        case _actions.ONLINE:
            return _extends({}, state, { isConnected: true });
        case _actions.OFFLINE:
            return _extends({}, state, { isConnected: false });
        case _actions.RESET_QUEUE:
            return _extends({}, state, { queue: [] });
        default:
            return state;
    }
}