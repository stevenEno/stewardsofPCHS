import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import GitGuidePage from './GitGuidePage';
import PathwaysPage from './PathwaysPage';
import SkillTreePage from './SkillTreePage';
import './styles/global.css';

function RootRouter() {
  if (window.location.pathname.startsWith('/pathways')) {
    return <PathwaysPage />;
  }

  if (window.location.pathname.startsWith('/git-walkthrough')) {
    return <GitGuidePage />;
  }

  if (window.location.pathname.startsWith('/skill-tree')) {
    return <SkillTreePage />;
  }

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>
);
