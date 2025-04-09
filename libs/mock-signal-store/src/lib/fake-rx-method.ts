import { rxMethod, type RxMethod } from '@ngrx/signals/rxjs-interop';
import { tap } from 'rxjs';
import { vi, type Mock } from 'vitest';

/**
 * FakeRxMethod mock type, it's an extended version of RxMethod, with an additional
 * [FAKE_RX_METHOD] property containing a Vitest fake (Mock<[T]>).
 */
export const FAKE_RX_METHOD = Symbol('FAKE_RX_METHOD');

export type FakeRxMethod<T> = RxMethod<T> & {
  [FAKE_RX_METHOD]: Mock<RxMethod<T>>;
};

/**
 * Converts the type of a (mocked) RxMethod into a FakeRxMethod.
 *
 * @template T - The argument type of the RxMethod.
 * @param {RxMethod<T>} rxMethod - The (mocked) RxMethod to be converted.
 * @returns {FakeRxMethod<T>} The converted FakeRxMethod.
 */
export function asFakeRxMethod<T>(rxMethod: RxMethod<T>): FakeRxMethod<T> {
  return rxMethod as FakeRxMethod<T>;
}

/**
 * Creates a new rxMethod mock.
 * The returned function accepts a static value, signal, or observable as an input argument.
 *
 * The Vitest fake stores the call information, when:
 * - the generated function was called with a static value.
 * - the generated function was called with a signal argument, and the signal's value changes.
 * - the generated function was called with an observable argument, and the observable emits.
 *
 * @returns {FakeRxMethod<T>} A new rxMethod mock.
 */
export function newFakeRxMethod<T>(): FakeRxMethod<T> {
  const f = vi.fn();
  const r = rxMethod<T>(tap((x) => f(x))) as unknown as FakeRxMethod<T>;
  // eslint-disable-next-line functional/immutable-data
  r[FAKE_RX_METHOD] = f;
  return r;
}

/**
 * Gets the Sinon fake from a mocked RxMethod.
 *
 * @template T - The argument type of the RxMethod.
 * @param {RxMethod<T>} rxMethod - The (mocked) RxMethod for which to retrieve the Vitest fake.
 * @returns {sinon.SinonSpy<[T], unknown>} The Vitest fake capturing calls to the RxMethod.
 */
export function getRxMethodFake<T>(rxMethod: RxMethod<T>): Mock<RxMethod<T>> {
  return asFakeRxMethod(rxMethod)[FAKE_RX_METHOD];
}
