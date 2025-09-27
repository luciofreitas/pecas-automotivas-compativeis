// Firebase initialization (modular SDK)
import './shims/process';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Prefer Vite-style env (import.meta.env) when available, otherwise process.env
let viteEnv = null;
try {
  // Access import.meta safely; some tools may rewrite or throw on direct typeof checks
  viteEnv = (typeof import.meta !== 'undefined' && import.meta && import.meta.env) ? import.meta.env : null;
} catch (e) {
  viteEnv = null;
}
const nodeEnv = (typeof process !== 'undefined' && process.env) || {};

const firebaseConfig = {
  apiKey: (viteEnv && viteEnv.VITE_FIREBASE_API_KEY) || nodeEnv.REACT_APP_FIREBASE_API_KEY || nodeEnv.FIREBASE_API_KEY,
  authDomain: (viteEnv && viteEnv.VITE_FIREBASE_AUTH_DOMAIN) || nodeEnv.REACT_APP_FIREBASE_AUTH_DOMAIN || nodeEnv.FIREBASE_AUTH_DOMAIN,
  projectId: (viteEnv && viteEnv.VITE_FIREBASE_PROJECT_ID) || nodeEnv.REACT_APP_FIREBASE_PROJECT_ID || nodeEnv.FIREBASE_PROJECT_ID,
  storageBucket: (viteEnv && viteEnv.VITE_FIREBASE_STORAGE_BUCKET) || nodeEnv.REACT_APP_FIREBASE_STORAGE_BUCKET || nodeEnv.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (viteEnv && viteEnv.VITE_FIREBASE_MESSAGING_SENDER_ID) || nodeEnv.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || nodeEnv.FIREBASE_MESSAGING_SENDER_ID,
  appId: (viteEnv && viteEnv.VITE_FIREBASE_APP_ID) || nodeEnv.REACT_APP_FIREBASE_APP_ID || nodeEnv.FIREBASE_APP_ID,
  measurementId: (viteEnv && viteEnv.VITE_FIREBASE_MEASUREMENT_ID) || nodeEnv.REACT_APP_FIREBASE_MEASUREMENT_ID || nodeEnv.FIREBASE_MEASUREMENT_ID,
};

// Debug: print which env source provided the vars (mask actual values)
try {
  const resolved = {
    apiKeySource: viteEnv && viteEnv.VITE_FIREBASE_API_KEY ? 'import.meta.env (VITE_)' : (nodeEnv.REACT_APP_FIREBASE_API_KEY || nodeEnv.FIREBASE_API_KEY) ? 'process.env' : 'none',
    authDomainSource: viteEnv && viteEnv.VITE_FIREBASE_AUTH_DOMAIN ? 'import.meta.env (VITE_)' : (nodeEnv.REACT_APP_FIREBASE_AUTH_DOMAIN || nodeEnv.FIREBASE_AUTH_DOMAIN) ? 'process.env' : 'none',
    projectIdSource: viteEnv && viteEnv.VITE_FIREBASE_PROJECT_ID ? 'import.meta.env (VITE_)' : (nodeEnv.REACT_APP_FIREBASE_PROJECT_ID || nodeEnv.FIREBASE_PROJECT_ID) ? 'process.env' : 'none',
    storageBucketSource: viteEnv && viteEnv.VITE_FIREBASE_STORAGE_BUCKET ? 'import.meta.env (VITE_)' : (nodeEnv.REACT_APP_FIREBASE_STORAGE_BUCKET || nodeEnv.FIREBASE_STORAGE_BUCKET) ? 'process.env' : 'none',
    appIdSource: viteEnv && viteEnv.VITE_FIREBASE_APP_ID ? 'import.meta.env (VITE_)' : (nodeEnv.REACT_APP_FIREBASE_APP_ID || nodeEnv.FIREBASE_APP_ID) ? 'process.env' : 'none',
  };
  // Only show non-secret diagnostics
  const maskedApiKey = (() => {
    const key = (viteEnv && viteEnv.VITE_FIREBASE_API_KEY) || nodeEnv.REACT_APP_FIREBASE_API_KEY || nodeEnv.FIREBASE_API_KEY || '';
    if (!key) return '(none)';
    return key.length > 8 ? `${key.slice(0,8)}...[masked]` : '[masked]';
  })();
  // eslint-disable-next-line no-console
  console.debug('[firebase] env sources:', resolved, 'maskedApiKey:', maskedApiKey);
} catch (e) {
  // eslint-disable-next-line no-console
  console.debug('[firebase] env debug failed', e && e.message);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
