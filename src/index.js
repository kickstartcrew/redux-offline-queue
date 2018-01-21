import * as actions from './actions'
import offlineMiddleware from './offlineMiddleware'
import { createOfflineActions, markActionsOffline } from './offlineActions'
import reducer from './reducer'
import suspendSaga from './suspendSaga'
import consumeActionMiddleware from './consumeActionMiddleware'

module.exports = {
  ONLINE: actions.ONLINE,
  OFFLINE: actions.OFFLINE,
  createOfflineActions,
  offlineMiddleware,
  markActionsOffline,
  reducer,
  suspendSaga,
  consumeActionMiddleware,
}
