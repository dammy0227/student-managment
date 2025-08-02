// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Provider } from 'react-redux';
import store, { persistor } from './store/store'; // 👈 updated to include persistor

import { PersistGate } from 'redux-persist/integration/react'; // 👈 import PersistGate

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
