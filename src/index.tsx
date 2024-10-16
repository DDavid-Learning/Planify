import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import FullScreenContainer from './app/components/layout/layout';
import { BrowserRouter } from 'react-router-dom';
import Theme from './themes';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './core/context/user/userContext';

const query = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ThemeProvider theme={Theme}>
    <QueryClientProvider client={query}>
      <BrowserRouter>
        <ToastContainer />
        <FullScreenContainer>
          <AppProvider>
            <App />
          </AppProvider>
          <ToastContainer />
        </FullScreenContainer>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);