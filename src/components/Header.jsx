import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { lang, setLang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      {/* زر تسجيل الخروج */}
      <button
        onClick={handleLogout}
        className="text-red-600 text-sm border border-red-600 px-3 py-1 rounded hover:bg-red-100 transition"
      >
        {isArabic ? 'تسجيل الخروج' : 'Logout'}
      </button>

      {/* الترحيب */}
      <span className="font-bold text-lg mx-auto">
        {user ? (
          <>
            {isArabic
              ? `مرحباً بعودتك، ${user.name} (${
                  user.role === 'admin' ? 'مدير' : 'موظف'
                })`
              : `Welcome back, ${user.name} (${
                  user.role === 'admin' ? 'Admin' : 'Agent'
                })`}
          </>
        ) : (
          'Tassfya'
        )}
      </span>

      {/* زر تغيير اللغة */}
      <button
        onClick={() => setLang(isArabic ? 'en' : 'ar')}
        className="text-blue-600 text-sm"
      >
        {isArabic ? 'English' : 'العربية'} 🌐
      </button>
    </header>
  );
}
