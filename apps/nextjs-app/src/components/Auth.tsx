import firebase from 'firebase/compat/app';
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import 'firebase/compat/auth';

const uiConfig: StyledFirebaseAuth['props']['uiConfig'] = {
  signInOptions: [
    {
      provider: 'google.com',
      clientId:
        '1031537215522-a5p950j8f4l323bn5t4n99p5i393hrp2.apps.googleusercontent.com',
    },
    'apple.com',
    'password',
  ],
  credentialHelper: 'googleyolo',
};

export const Auth: React.FC<{ firebaseAuth: firebase.auth.Auth }> = ({
  firebaseAuth,
}) => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebaseAuth}
  />
);
