import { useState } from 'react';
import { interpret, StateFrom } from 'xstate';
import { inspect } from '@xstate/inspect';
import { useSelector } from '@xstate/react';
import { AuthMachineContext } from '../contexts';
import { authMachine } from '../state-machines';
import { Auth } from './Auth';
import { NavWrapper } from './NavWrapper';

if (
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_USE_XSTATE_INSPECT === 'true'
) {
  inspect({ iframe: false });
}

const authMachineInitializer = () =>
  interpret(authMachine, {
    devTools: process.env.NEXT_PUBLIC_USE_XSTATE_INSPECT === 'true',
  }).start();

const stateSelector = (state: StateFrom<typeof authMachine>) =>
  state.toStrings()[0];

export const AuthWrapper: React.FC = () => {
  const [authMachine] = useState(authMachineInitializer);
  const state = useSelector(authMachine, stateSelector);
  return (
    <AuthMachineContext.Provider value={authMachine}>
      {state === 'authenticated' ? (
        <NavWrapper />
      ) : state === 'notAuthenticated' ? (
        <Auth firebaseAuth={authMachine.state.context.firebaseAuth} />
      ) : (
        'Loading'
      )}
    </AuthMachineContext.Provider>
  );
};
