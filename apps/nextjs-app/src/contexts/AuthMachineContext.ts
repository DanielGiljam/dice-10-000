import React from 'react';
import { InterpreterFrom } from 'xstate';
import { authMachine } from '../state-machines';

export const AuthMachineContext =
  React.createContext<InterpreterFrom<typeof authMachine>>(undefined);
