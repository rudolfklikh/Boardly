import { computed, type Signal } from '@angular/core';
import {
  signalStoreFeature,
  withComputed,
  withState,
  type EmptyFeatureResult,
  type SignalStoreFeature
} from '@ngrx/signals';

export type CallState = 'init' | 'loading' | 'loaded' | { error: string };

export interface CallStateSlice {
  callState: CallState;
}

export interface CallStateSignals {
  loading: Signal<boolean>;
  loaded: Signal<boolean>;
  error: Signal<string | null>;
}

export type NamedCallStateSlice<Collection extends string> = {
  [K in keyof CallStateSlice as `${Collection}${Capitalize<K>}`]: CallStateSlice[K];
};

export type NameCallStateSignals<Collection extends string> = {
  [K in keyof CallStateSignals as `${Collection}${Capitalize<K>}`]: CallStateSignals[K];
};

export type SetCallState<Prop extends string | undefined = undefined> =
  Prop extends string ? NamedCallStateSlice<Prop> : CallStateSlice;

export function getCallStateKeys(config?: Readonly<{ collection?: string }>) {
  const prop = config?.collection;
  return {
    callStateKey: prop ? `${config.collection}CallState` : 'callState',
    loadingKey: prop ? `${config.collection}Loading` : 'loading',
    loadedKey: prop ? `${config.collection}Loaded` : 'loaded',
    errorKey: prop ? `${config.collection}Error` : 'error'
  };
}

export function withCallState<Collection extends string>(
  config: Readonly<{
    collection: Collection;
  }>
): SignalStoreFeature<
  EmptyFeatureResult,
  EmptyFeatureResult & {
    state: NamedCallStateSlice<Collection>;
    props: NameCallStateSignals<Collection>;
  }
>;
export function withCallState(): SignalStoreFeature<
  EmptyFeatureResult,
  EmptyFeatureResult & {
    state: CallStateSlice;
    props: CallStateSignals;
  }
>;
export function withCallState<Collection extends string>(
  config?: Readonly<{
    collection: Collection;
  }>
): SignalStoreFeature {
  const { callStateKey, loadingKey, loadedKey, errorKey } =
    getCallStateKeys(config);

  return signalStoreFeature(
    withState({
      [callStateKey]: 'init'
    }),
    withComputed((state: Record<string, Signal<unknown>>) => {
      const callState = state[callStateKey] as Signal<CallState>;

      return {
        [loadingKey]: computed(() => callState() === 'loading'),
        [loadedKey]: computed(() => callState() === 'loaded'),
        [errorKey]: computed(() => {
          const v = callState();
          return typeof v === 'object' ? v.error : null;
        })
      };
    })
  );
}

export function setLoading<Prop extends string | undefined = undefined>(
  prop?: Prop
): SetCallState<Prop> {
  return {
    [`${prop ? prop + 'C' : 'c'}allState`]: 'loading'
  } as SetCallState<Prop>;
}

export function setLoaded<Prop extends string | undefined = undefined>(
  prop?: Prop
): SetCallState<Prop> {
  return {
    [`${prop ? prop + 'C' : 'c'}allState`]: 'loaded'
  } as SetCallState<Prop>;
}

export function setError<Prop extends string | undefined = undefined>(
  error: unknown,
  prop?: Prop
): SetCallState<Prop> {
  let errorMessage: string;

  if (!error) {
    errorMessage = '';
  } else if (typeof error === 'object' && 'message' in error) {
    errorMessage = String(error.message);
  } else {
    errorMessage = String(error);
  }

  return {
    [`${prop ? prop + 'C' : 'c'}allState`]: { error: errorMessage }
  } as SetCallState<Prop>;
}
