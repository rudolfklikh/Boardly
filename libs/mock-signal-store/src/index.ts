/*
 * Public API Surface of fake-rx-method
 */

export {
  FAKE_RX_METHOD,
  asFakeRxMethod,
  getRxMethodFake,
  newFakeRxMethod,
  type FakeRxMethod
} from './lib/fake-rx-method';

/*
 * Public API Surface of mock-signal-store
 */

export {
  asMockSignalStore,
  asVitestSpy,
  asWritableSignal,
  provideMockSignalStore,
  type MockSignalStore,
  type ProvideMockSignalStoreParams
} from './lib/mock-signal-store';
