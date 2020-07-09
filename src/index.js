import * as actions from './actions'
import offlineMiddleware from './offlineMiddleware'
import { createOfflineActions, markActionsOffline, queueAction, removeAction } from './offlineActions'
import reducer from './reducer'
import suspendSaga from './suspendSaga'
import consumeActionMiddleware from './consumeActionMiddleware'
import offlinePersistenceTransform from './offlinePersistenceTransform'

module.exports = {
  ONLINE: actions.ONLINE,
  OFFLINE: actions.OFFLINE,
  createOfflineActions,
  offlineMiddleware,
  markActionsOffline,
  queueAction,
  removeAction,
  reducer,
  suspendSaga,
  consumeActionMiddleware,
  offlinePersistenceTransform,
}
