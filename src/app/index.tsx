import AuthProvider from 'app/providers/Auth';

import {AppRouter} from './providers';

import React from 'react';
import './index.scss';
import {DateProvider} from 'context/DateProvider';
import {Provider} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import store from 'store';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <DateProvider>
          <AppRouter />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            closeOnClick
            theme="light"
          />
        </DateProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
