import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import FullScreenContainer from './app/components/layout/layout';
import { BrowserRouter } from 'react-router-dom';
import Theme from './themes';
import { ThemeProvider } from 'styled-components';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <FullScreenContainer>
          <App />
        </FullScreenContainer>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);