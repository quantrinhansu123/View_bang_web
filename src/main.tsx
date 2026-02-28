import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/customers" element={<App initialTab="customers" />} />
        <Route path="/people" element={<App initialTab="people" />} />
        <Route path="/" element={<Navigate to="/customers" replace />} />
      </Routes>
    </Router>
  </StrictMode>,
);
