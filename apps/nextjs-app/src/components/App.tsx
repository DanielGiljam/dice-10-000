import { Loading } from './Loading';
import shallow from 'zustand/shallow';
import React from 'react';
import { AuthStore, useAuthStore } from '../stores';
import { Auth } from './Auth';
import { MainMenu } from './MainMenu';

const selector = (authStore: AuthStore) => ({
  activate: authStore.activate,
  state: authStore.state,
});

const componentMap = {
  authenticating: Loading,
  authenticated: MainMenu,
  not_authenticated: Auth,
};

export const App: React.FC = () => {
  const { activate, state } = useAuthStore(selector, shallow);
  React.useEffect(() => activate(), [activate]);
  const Component = componentMap[state];
  return (
    <div className={'h-screen'}>
      <Component />
    </div>
  );
};
