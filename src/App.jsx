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

export default function App() {
  const { lang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-gray-100"
    >
      <Header />
      <div
        className={`flex flex-1 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            {/* All routes prefixed with /dashboard/... */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/employees" element={<Employees />} />
            <Route path="/dashboard/reports" element={<Reports />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/ads" element={<AdAnalytics />} />
            <Route path="*" element={<Dashboard />} />
            <Route
              path="/dashboard/fulfillment"
              element={<FulfillmentCenter />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
