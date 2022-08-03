import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Configure Firebase.
const firebaseConfig = {
  apiKey: 'AIzaSyDJNe6bRVqLdBh_n2LPHXAfrwFZrdWrWac',
  authDomain: 'dice-10-000.firebaseapp.com',
  projectId: 'dice-10-000',
  storageBucket: 'dice-10-000.appspot.com',
  messagingSenderId: '1031537215522',
  appId: '1:1031537215522:web:101480e74ffd8b5076a27b',
  measurementId: 'G-VPHZ1CQY7Q',
};
firebase.initializeApp(firebaseConfig);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH_EMULATOR === 'true') {
  firebase.auth().useEmulator('http://localhost:9099');
}

// Configure FirebaseUI.
const uiConfig: StyledFirebaseAuth['props']['uiConfig'] = {
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    'anonymous',
  ],
};

export const Login: React.FC = () => (
  <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
);
