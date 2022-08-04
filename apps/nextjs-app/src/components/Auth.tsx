import firebase from 'firebase/compat/app';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import 'firebase/compat/auth';

const uiConfig: StyledFirebaseAuth['props']['uiConfig'] = {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    'anonymous',
  ],
};

export const Auth: React.FC<{ firebaseAuth: firebase.auth.Auth }> = ({
  firebaseAuth,
}) => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebaseAuth}
  />
);
