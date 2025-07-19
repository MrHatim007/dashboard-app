import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './pages/Login';
import { LanguageProvider } from './context/LanguageContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<App />} />{' '}
          {/* ✅ هذا يسمح بتحميل جميع صفحات App مثل /dashboard و /orders وغيرها */}
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);
