import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import GitGuidePage from './GitGuidePage';
import PathwaysPage from './PathwaysPage';
import './styles/global.css';

function RootRouter() {
  if (window.location.pathname.startsWith('/pathways')) {
    return <PathwaysPage />;
  }

  if (window.location.pathname.startsWith('/git-walkthrough')) {
    return <GitGuidePage />;
  }

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>
);
