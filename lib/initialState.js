"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Initial state for the offline queue.
 *
 * @param {Array} queue Keeps an array of redux actions that are queued in the offline mode.
 * @param {Boolean} isConnected Boolean indicating if the device is connected to the Internet.
 */
exports.default = {
  queue: [],
  isConnected: true
};