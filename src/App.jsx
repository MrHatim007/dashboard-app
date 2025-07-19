import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageContext } from './context/LanguageContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdAnalytics from './pages/AdAnalytics';
import FulfillmentCenter from './pages/FulfillmentCenter';
import Login from './pages/Login'; // ✅ استيراد صفحة تسجيل الدخول
import PrivateRoute from './PrivateRoute'; // ✅ استيراد الحماية

export default function App() {
  const { lang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';

  const layout = (
    <>
      <Header />
      <div
        className={`flex flex-1 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            {/* كل صفحات لوحة التحكم الآن محمية */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/employees"
              element={
                <PrivateRoute>
                  <Employees />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/ads"
              element={
                <PrivateRoute>
                  <AdAnalytics />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/fulfillment"
              element={
                <PrivateRoute>
                  <FulfillmentCenter />
                </PrivateRoute>
              }
            />
            {/* صفحة افتراضية */}
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </>
  );

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col bg-gray-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* كل صفحات لوحة التحكم داخل layout المحمي */}
        <Route path="/*" element={layout} />
      </Routes>
    </div>
  );
}