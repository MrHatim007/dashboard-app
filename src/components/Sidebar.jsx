import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import {
  MdDashboard,
  MdShoppingCart,
  MdPeople,
  MdBarChart,
  MdSettings,
  MdCampaign,
  MdLocalShipping,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const { lang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userPermissions = user.permissions || [];

  const items = [
    {
      key: 'dashboard',
      ar: 'لوحة التحكم',
      en: 'Dashboard',
      icon: <MdDashboard />,
      path: '/dashboard',
    },
    {
      key: 'orders',
      ar: 'الطلبات',
      en: 'Orders',
      icon: <MdShoppingCart />,
      path: '/dashboard/orders',
    },
    {
      key: 'fulfillment',
      ar: 'مركز التنفيذ',
      en: 'Fulfillment Center',
      icon: <MdLocalShipping />,
      path: '/dashboard/fulfillment',
    },
    {
      key: 'employees',
      ar: 'الموظفون',
      en: 'Employees',
      icon: <MdPeople />,
      path: '/dashboard/employees',
    },
    {
      key: 'ads',
      ar: 'تحليلات الإعلانات',
      en: 'Ad Spending',
      icon: <MdCampaign />,
      path: '/dashboard/ads',
    },
    {
      key: 'reports',
      ar: 'التقارير',
      en: 'Reports',
      icon: <MdBarChart />,
      path: '/dashboard/reports',
    },
    {
      key: 'settings',
      ar: 'الإعدادات',
      en: 'Settings',
      icon: <MdSettings />,
      path: '/dashboard/settings',
    },
  ];

  return (
    <div
      className={`w-48 bg-blue-900 text-white py-6 px-4 min-h-screen ${
        isArabic ? 'order-last text-right' : 'text-left'
      }`}
    >
      <h2 className="text-xl font-bold mb-6">
        {isArabic ? 'القائمة' : 'Menu'}
      </h2>
      <ul
        className={`flex flex-col space-y-4 ${
          isArabic ? 'items-end' : 'items-start'
        }`}
      >
        {items
          .filter((item) => userPermissions.includes(item.key))
          .map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={`w-full flex items-center hover:text-yellow-300 cursor-pointer ${
                isArabic ? 'justify-end' : 'justify-start'
              }`}
            >
              {isArabic ? (
                <>
                  <div className="ml-2 text-xl">{item.icon}</div>
                  <div className="flex-1 text-right">{item.ar}</div>
                </>
              ) : (
                <>
                  <div className="text-xl mr-2">{item.icon}</div>
                  <div className="flex-1">{item.en}</div>
                </>
              )}
            </NavLink>
          ))}
      </ul>
    </div>
  );
}
