"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = suspendSaga;
/**
 * Custom wrapper for the saga middleware that can skip firing the saga.
 *
 * In case of the offline action we do want it to be dispatched
 * so that the reducer updates the local state in a optimistic manner.
 *
 * However since we know for sure that the device is offline
 * the corresponding saga should not be fired.
 *
 * For the action to skip the saga it should have:
 * ```
 * skipSaga: true
 * ```
 * property set.
 *
 * Note: One should wrap the existing saga middleware for this to work correctly,
 * for example:
 * ```
 * const sagaMiddleware = createSagaMiddleware()
 * const suspendSagaMiddleware = suspendSaga(sagaMiddleware)
 * ```
 *
 * @param {Function} middleware Saga middleware.
 */
function suspendSaga(middleware) {
  return function (store) {
    return function (next) {
      var delegate = middleware(store)(next);

      return function (action) {
        var skipSaga = action.skipSaga;

        if (skipSaga) {
          return next(action);
        }
        return delegate(action);
      };
    };
  };
}