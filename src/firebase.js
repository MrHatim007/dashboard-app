import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDB35uKiH3wUBzLEz4j5Vl1yHWqVJsRl_s',
  authDomain: 'dashboard-a762b.firebaseapp.com',
  projectId: 'dashboard-a762b',
  storageBucket: 'dashboard-a762b.firebasestorage.app',
  messagingSenderId: '946404827327',
  appId: '1:946404827327:web:87bbc15e174dceab79e60a',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
