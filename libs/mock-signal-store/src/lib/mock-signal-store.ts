/* eslint-disable functional/prefer-immutable-types */
/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Type,
  isSignal,
  signal,
  untracked,
  type Provider,
  type Signal,
  type WritableSignal
} from '@angular/core';
import {
  getState,
  patchState,
  type DeepSignal,
  type StateSource,
  type WritableStateSource
} from '@ngrx/signals';
import { type RxMethod } from '@ngrx/signals/rxjs-interop';
import { vi, type Mock } from 'vitest';
import { newFakeRxMethod, type FakeRxMethod } from './fake-rx-method';

type NonRecord =
  | Iterable<any>
  | WeakSet<any>
  | WeakMap<any, any>
  | Promise<any>
  | Date
  | Error
  | RegExp
  | ArrayBuffer
  | DataView
  | Function;

type IsRecord<T> = T extends object
  ? T extends NonRecord
    ? false
    : true
  : false;

type Method<T extends readonly any[] = any[]> = (...args: T) => unknown;

type InitialState<T> = T extends StateSource<infer U> ? U : never;

/**
 * Given a type T, determines the keys of the signal properties.
 */
type SignalKeys<T> = {
  // -? makes the key required, opposite of ?
  [K in keyof T]-?: T[K] extends Signal<unknown> ? K : never;
}[keyof T];

/**
 * Type to extract the wrapped type from a Signal type.
 *
 * @template T - The original Signal type.
 * @returns The unwrapped type if T is a Signal, otherwise, 'never'.
 */
type UnwrapSignal<T> = T extends Signal<infer U> ? U : never;

export type MockSignalStore<T> = {
  readonly [K in keyof T]: T[K] extends Signal<infer S>
    ? IsRecord<T[K]> extends true
      ? T[K] extends DeepSignal<infer D>
        ? DeepSignal<D>
        : T[K]
      : WritableSignal<S>
    : T[K] extends RxMethod<infer R>
      ? FakeRxMethod<R>
      : T[K] extends Method
        ? Mock<T[K]>
        : T[K];
};

/**
 * Converts the type of a (mocked) SignalStore to a MockSignalStore
 */
export function asMockSignalStore<T>(s: T): MockSignalStore<T> {
  return s as MockSignalStore<T>;
}

/**
 * Converts the type of a (mocked) function to a Vitest Spy
 */
export function asVitestSpy(fn: Method): Mock<Method> {
  return fn as unknown as Mock<Method>;
}

/**
 * Converts the type of a (mocked) Signal to a WritableSignal
 */
export function asWritableSignal<T>(s: Signal<T>): WritableSignal<T> {
  return s as WritableSignal<T>;
}

/**
 * Parameters for providing a mock signal store.
 *
 * @template T The type of the original signal store.
 * @param initialStatePatch A partial initial state to override the original initial state.
 * @param initialComputedValues Initial values for computed signals.
 * @param mockComputedSignals Flag to mock computed signals (default is true).
 * @param mockMethods Flag to mock methods (default is true).
 * @param mockRxMethods Flag to mock RxMethods (default is true).
 * @param debug Flag to enable debug mode (default is false).
 */
export interface ProvideMockSignalStoreParams<T> {
  initialStatePatch?: Partial<InitialState<T>>;
  initialComputedValues?: Omit<
    {
      [K in SignalKeys<T>]?: UnwrapSignal<T[K]>;
    },
    keyof InitialState<T>
  >;
  mockComputedSignals?: boolean;
  mockMethods?: boolean;
  mockRxMethods?: boolean;
  debug?: boolean;
}

/**
 * Provides a mock version of signal store.
 *
 * @template ClassType The class type that extends StateSignal<object>.
 * @param classConstructor The constructor function for the class.
 * @param params Optional parameters for providing the mock signal store.
 * @returns The provider for the mock signal store.
 */

export function provideMockSignalStore<ClassType extends StateSource<object>>(
  classConstructor: Type<ClassType>,
  params?: ProvideMockSignalStoreParams<ClassType>
): Provider {
  let cachedStore: ClassType | undefined = undefined;
  return {
    provide: classConstructor,
    // eslint-disable-next-line complexity
    useFactory: () => {
      // use the cached instance of the store to work around Angular
      // attaching created items to certain nodes.
      if (cachedStore) {
        return cachedStore as MockSignalStore<ClassType>;
      }
      const store = Reflect.construct(classConstructor, []);
      cachedStore = store;

      const keys = Object.keys(store) as Array<keyof ClassType>;

      const pluckerSignals = keys.filter(
        (k) => isSignal(store[k]) && k in getState(store)
      );
      const combinedSignals = keys.filter(
        (k) => isSignal(store[k]) && !pluckerSignals.includes(k)
      );

      const rxMethods = keys.filter(
        (k) =>
          typeof store[k] === 'function' &&
          !isSignal(store[k]) &&
          (store[k] as unknown as Record<keyof RxMethod<any>, any>)['destroy']
      );
      const methods = keys.filter(
        (k) =>
          typeof store[k] === 'function' &&
          !isSignal(store[k]) &&
          !rxMethods.includes(k)
      );

      if (params?.debug === true) {
        console.debug('pluckerSignals', pluckerSignals);
        console.debug('combinedSignals', combinedSignals);
        console.debug('rxMethods', rxMethods);
        console.debug('methods', methods);
      }

      if (!params?.mockComputedSignals) {
        combinedSignals.forEach((k) => {
          if (
            params?.initialComputedValues &&
            k in params.initialComputedValues
          ) {
            store[k] = signal(
              (params.initialComputedValues as any)[k]
            ) as unknown as ClassType[keyof object];
          } else {
            throw new Error(`${String(k)} should have an initial value`);
          }
        });
      }

      if (!params?.mockMethods) {
        methods.forEach((k) => {
          store[k] = vi.fn() as ClassType[keyof ClassType];
        });
      }

      if (!params?.mockRxMethods) {
        rxMethods.forEach((k) => {
          store[k] = newFakeRxMethod<unknown>() as ClassType[keyof ClassType];
        });
      }

      if (params?.initialStatePatch) {
        untracked(() => {
          patchState(store as unknown as WritableStateSource<object>, (s) => ({
            ...s,
            ...params.initialStatePatch
          }));
        });
      }

      if (params?.debug === true) {
        console.debug('Mocked store:', store);
      }

      return store as MockSignalStore<ClassType>;
    }
  };
}
