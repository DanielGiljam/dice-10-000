import firebase from 'firebase/compat/app';
import { map, Observable } from 'rxjs';
import { assign, createMachine } from 'xstate';
import firebaseProjectConfig from '../../../../firebase.json';
import { isNullish, XStateEventFromTypeMap } from '../utils';
import { firebaseConfig as firebaseAppConfig } from '../firebaseConfig';

import 'firebase/compat/auth';

interface EventTypeMap {
  AUTHENTICATED: {
    user: firebase.User;
  };
  NOT_AUTHENTICATED: {}; // eslint-disable-line @typescript-eslint/ban-types
  SIGN_OUT: {}; // eslint-disable-line @typescript-eslint/ban-types
}

export const authMachine = createMachine(
  {
    tsTypes: {} as import('./authMachine.typegen').Typegen0,
    schema: {
      context: {} as {
        firebaseApp: firebase.app.App;
        firebaseAuth: firebase.auth.Auth;
        authError?: unknown;
        signingOutErrors: unknown[];
      },
      events: {} as XStateEventFromTypeMap<EventTypeMap>,
      services: {} as {
        signOutPromise: {
          data: void;
        };
      },
    },
    id: 'authMachine',
    invoke: {
      id: 'firebaseAuthStateObserver',
      src: 'firebaseAuthStateObserver',
      onError: {
        actions: 'setAuthError',
      },
    },
    on: {
      AUTHENTICATED: '.authenticated',
      NOT_AUTHENTICATED: '.notAuthenticated',
    },
    initial: 'authenticating',
    states: {
      authenticating: {},
      authenticated: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              SIGN_OUT: 'signingOut',
            },
          },
          signingOut: {
            invoke: {
              id: 'signOutPromise',
              src: 'signOutPromise',
              onDone: '..notAuthenticated',
              onError: {
                target: 'idle',
                actions: 'setSigningOutError',
              },
            },
          },
        },
      },
      notAuthenticated: {},
    },
  },
  {
    actions: {
      setAuthError: assign({
        authError: (_context, event) => event.data,
      }),
      setSigningOutError: assign({
        signingOutErrors: (context, event) => [
          ...context.signingOutErrors,
          event.data,
        ],
      }),
    },
    services: {
      firebaseAuthStateObserver: (context) =>
        new Observable((subscriber) =>
          context.firebaseAuth.onAuthStateChanged({
            next: subscriber.next.bind(subscriber),
            error: subscriber.error.bind(subscriber),
            complete: subscriber.complete.bind(subscriber),
          })
        ).pipe(
          map((user) =>
            isNullish(user)
              ? { type: 'NOT_AUTHENTICATED' }
              : { type: 'AUTHENTICATED', user }
          )
        ),
      signOutPromise: (context) => context.firebaseAuth.signOut(),
    },
  }
).withContext(() => {
  const firebaseApp = firebase.initializeApp(firebaseAppConfig);
  const firebaseAuth = firebase.auth(firebaseApp);
  if (
    process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH_EMULATOR === 'true' &&
    isNullish(firebaseAuth.emulatorConfig)
  ) {
    firebaseAuth.useEmulator(
      `http://localhost:${firebaseProjectConfig.emulators.auth.port}`
    );
  }
  return {
    firebaseApp,
    firebaseAuth,
    signingOutErrors: [],
  };
});
