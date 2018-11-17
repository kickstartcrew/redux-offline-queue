'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxPersist = require('redux-persist');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OMIT_KEYS = ['isConnected'];

/**
 * Custom redux-persist transformation
 * to omit persisting `isConnected` key from offline queue.
 */
exports.default = (0, _reduxPersist.createTransform)(function (inboundState) {
  return _lodash2.default.omit(inboundState, OMIT_KEYS);
}, function (outboundState) {
  return outboundState;
}, { whitelist: ['offline'] });