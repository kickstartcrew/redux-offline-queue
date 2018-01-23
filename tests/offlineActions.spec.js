import { createOfflineActions, markActionsOffline } from '../src/offlineActions'

test('createOfflineActions returns enchanced actions with offline meta keys', () => {
  const { Creators } = createOfflineActions({
    test: ['testId'],
  })

  expect(Creators.test(1)).toEqual({
    type: 'TEST',
    testId: 1,
    meta: {
      queueIfOffline: true,
    },
  })
})

test('markActionsOffline modifies Creators object', () => {
  const Creators = {
    test: testId => ({
      type: 'TEST',
      testId,
    }),
  }

  markActionsOffline(Creators, ['test'])

  expect(Creators.test(1)).toEqual({
    type: 'TEST',
    testId: 1,
    meta: {
      queueIfOffline: true,
    },
  })
})
