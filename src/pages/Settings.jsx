// src/pages/Settings.jsx
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { db } from '../firebase';
import PrivateRoute from '../PrivateRoute'; // أو './PrivateRoute' حسب مكان الملف
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

export default function Settings() {
  const { lang, setLang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';

  const [theme, setTheme] = useState('light');
  const [currency, setCurrency] = useState('USD');
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    orders: true,
    employees: false,
    ads: false,
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [sheetSources, setSheetSources] = useState([]);
  const [newSheet, setNewSheet] = useState({ url: '', site: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.documentElement.className = theme;
    fetchSheetSources();
  }, [theme]);

  const fetchSheetSources = async () => {
    const snapshot = await getDocs(collection(db, 'sheetSources'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSheetSources(data);
  };

  const handleCompanyChange = (key, value) =>
    setCompanyInfo({ ...companyInfo, [key]: value });

  const handlePasswordChange = (key, value) =>
    setPassword({ ...password, [key]: value });

  const toggleNotification = (key) =>
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });

  const handleSave = () => {
    setMessage(isArabic ? '✅ تم حفظ المعلومات' : '✅ Info saved successfully');
    setTimeout(() => setMessage(''), 2000);
  };

  const handlePasswordUpdate = () => {
    if (password.new !== password.confirm) {
      alert(isArabic ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }
    setMessage(isArabic ? '✅ تم تحديث كلمة المرور' : '✅ Password updated');
    setPassword({ current: '', new: '', confirm: '' });
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSheetInput = (key, value) =>
    setNewSheet({ ...newSheet, [key]: value });

  const addSheetSource = async () => {
    if (!newSheet.url || !newSheet.site) return;
    await addDoc(collection(db, 'sheetSources'), newSheet);
    setNewSheet({ url: '', site: '' });
    fetchSheetSources();
  };

  const deleteSheetSource = async (id) => {
    await deleteDoc(doc(db, 'sheetSources', id));
    fetchSheetSources();
  };

  return (
      <PrivateRoute>
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="p-6 max-w-4xl mx-auto space-y-8"
    >
      <h1 className="text-2xl font-bold text-gray-800">
        {isArabic ? 'الإعدادات' : 'Settings'}
      </h1>

      {/* Company Info */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          {isArabic ? 'معلومات الشركة' : 'Company Information'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="p-2 border rounded"
            placeholder={isArabic ? 'اسم الشركة' : 'Company Name'}
            value={companyInfo.name}
            onChange={(e) => handleCompanyChange('name', e.target.value)}
          />
          <input
            className="p-2 border rounded"
            placeholder="Email"
            value={companyInfo.email}
            onChange={(e) => handleCompanyChange('email', e.target.value)}
          />
          <input
            className="p-2 border rounded"
            placeholder={isArabic ? 'رقم الهاتف' : 'Phone Number'}
            value={companyInfo.phone}
            onChange={(e) => handleCompanyChange('phone', e.target.value)}
          />
          <input
            className="p-2 border rounded"
            placeholder={isArabic ? 'العنوان' : 'Address'}
            value={companyInfo.address}
            onChange={(e) => handleCompanyChange('address', e.target.value)}
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isArabic ? 'حفظ المعلومات' : 'Save Info'}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          {isArabic ? 'الإعدادات العامة' : 'General Settings'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="light">{isArabic ? 'فاتح' : 'Light'}</option>
            <option value="dark">{isArabic ? 'مظلم' : 'Dark'}</option>
          </select>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="USD">USD</option>
            <option value="AED">AED</option>
            <option value="SAR">SAR</option>
            <option value="MAD">MAD</option>
          </select>
        </div>
      </div>

      {/* Google Sheet Sources */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          {isArabic ? 'مصادر جوجل شيت' : 'Google Sheets Sources'}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            className="p-2 border rounded flex-1"
            placeholder={isArabic ? 'رابط Google Sheet' : 'Google Sheet URL'}
            value={newSheet.url}
            onChange={(e) => handleSheetInput('url', e.target.value)}
          />
          <input
            className="p-2 border rounded flex-1"
            placeholder={
              isArabic ? 'اسم الموقع أو رابط الموقع' : 'Site name or URL'
            }
            value={newSheet.site}
            onChange={(e) => handleSheetInput('site', e.target.value)}
          />
          <button
            onClick={addSheetSource}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isArabic ? 'إضافة' : 'Add'}
          </button>
        </div>

        <ul className="mt-4 space-y-2 text-sm">
          {sheetSources.map((source) => (
            <li
              key={source.id}
              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
            >
              <span>
                <strong>{source.site}</strong>: {source.url}
              </span>
              <button
                onClick={() => deleteSheetSource(source.id)}
                className="text-red-600 hover:underline text-xs"
              >
                {isArabic ? 'حذف' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Password */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          {isArabic ? 'تغيير كلمة المرور' : 'Change Password'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder={isArabic ? 'كلمة المرور الحالية' : 'Current Password'}
            value={password.current}
            onChange={(e) => handlePasswordChange('current', e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="password"
            placeholder={isArabic ? 'كلمة المرور الجديدة' : 'New Password'}
            value={password.new}
            onChange={(e) => handlePasswordChange('new', e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="password"
            placeholder={
              isArabic ? 'تأكيد كلمة المرور' : 'Confirm New Password'
            }
            value={password.confirm}
            onChange={(e) => handlePasswordChange('confirm', e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handlePasswordUpdate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {isArabic ? 'تحديث كلمة المرور' : 'Update Password'}
        </button>
      </div>

      {/* Notification Settings */}
      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          {isArabic ? 'إعدادات الإشعارات' : 'Notification Settings'}
        </h2>
        <div className="space-y-2">
          {Object.keys(notificationSettings).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notificationSettings[key]}
                onChange={() => toggleNotification(key)}
              />
              {isArabic
                ? key === 'orders'
                  ? 'إشعارات الطلبات'
                  : key === 'employees'
                  ? 'إشعارات الموظفين'
                  : 'إشعارات الإعلانات'
                : key === 'orders'
                ? 'Order Notifications'
                : key === 'employees'
                ? 'Employee Notifications'
                : 'Ad Notifications'}
            </label>
          ))}
        </div>
      </div>

      {message && (
        <p className="text-green-600 text-center font-semibold">{message}</p>
      )}
    </div>
    </PrivateRoute>
  );
}
