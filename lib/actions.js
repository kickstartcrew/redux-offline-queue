'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ACTION_PREFIX = 'redux-offline-queue/';

/**
 * External actions.
 * Should be called from the outside to property set the connection state.
 *
 * We're doing it this way to not couple tighly with react-native and make it possible
 * to use the queue in a different environment.
 */
var ONLINE = exports.ONLINE = ACTION_PREFIX + 'ONLINE';
var OFFLINE = exports.OFFLINE = ACTION_PREFIX + 'OFFLINE';

/**
 * Internal actions.
 * These are fired to manage the internal offline queue state.
 */
var QUEUE_ACTION = exports.QUEUE_ACTION = ACTION_PREFIX + 'QUEUE_ACTION';
var RESET_QUEUE = exports.RESET_QUEUE = ACTION_PREFIX + 'RESET_QUEUE';