import React from 'react';
import { AuthStore, useAuthStore } from '../stores';
import shallow from 'zustand/shallow';

const selector = (authStore: AuthStore) => ({
  user: authStore.session?.user,
  signOut: authStore.signOut,
});

export const MainMenu: React.FC = () => {
  const { user, signOut } = useAuthStore(selector, shallow);
  console.log('user', user);
  return (
    <div
      className={'flex flex-col gap-8 items-center justify-center h-full p-8'}
    >
      <header>
        <h1 className={'text-2xl'}>Dice 10 000</h1>
      </header>
      <main className={'flex flex-col gap-2 items-center justify-center'}>
        <span>You are signed in.</span>
        <span>Rest of the app is under construction.</span>
        <span className={'text-xl'}>🚧🚧🚧</span>
        <button
          onClick={signOut}
          className={
            'inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150'
          }
        >
          Sign out
        </button>
      </main>
    </div>
  );
};
