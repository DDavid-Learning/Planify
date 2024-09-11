import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material';
import theme from './core/theme/theme';
import FullScreenContainer from './app/components/layout/layout';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FullScreenContainer>
        <App />
      </FullScreenContainer>
    </BrowserRouter>
  </React.StrictMode>
);