import { createTransform } from 'redux-persist'
import _ from 'lodash'

const OMIT_KEYS = ['isConnected']

/**
 * Custom redux-persist transformation
 * to omit persisting `isConnected` key from offline queue.
 */
export default createTransform(
  inboundState => _.omit(inboundState, OMIT_KEYS),
  outboundState => outboundState,
  { whitelist: ['offline'] },
)
