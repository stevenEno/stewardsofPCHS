import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import PathwaysPage from './PathwaysPage';
import './styles/global.css';

function RootRouter() {
  if (window.location.pathname.startsWith('/pathways')) {
    return <PathwaysPage />;
  }

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>
);
