import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const { lang, setLang } = useContext(LanguageContext);
  const navigate = useNavigate();

  const isArabic = lang === 'ar';

  const handleLogin = async () => {
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const docRef = doc(db, 'employees', uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError(
          isArabic
            ? 'الموظف غير مسجل في النظام'
            : 'Employee not found in system'
        );
        await signOut(auth);
        return;
      }

      const userData = docSnap.data();

      if (userData.status !== 'active') {
        setError(isArabic ? 'تم تعطيل هذا الحساب' : 'This account is inactive');
        await signOut(auth);
        return;
      }

      // ✅ إعطاء صلاحيات كاملة تلقائياً للإداري إذا لم تكن موجودة
      if (
        userData.role === 'admin' &&
        (!userData.permissions || userData.permissions.length === 0)
      ) {
        userData.permissions = [
          'dashboard',
          'orders',
          'employees',
          'ads',
          'reports',
          'settings',
        ];
      }

      // ✅ تخزين بيانات الموظف وصلاحياته
      localStorage.setItem(
        'user',
        JSON.stringify({
          uid,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          permissions: userData.permissions || [],
        })
      );

      navigate('/dashboard');
    } catch (err) {
      setError(
        isArabic
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : 'Invalid email or password'
      );
    }
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen flex justify-center items-center bg-gray-100"
    >
      <div className="w-[350px] bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">
          {isArabic ? 'تسجيل الدخول إلى' : 'Login to'}{' '}
          <span className="text-blue-600">
            {isArabic ? 'تصفية للعطور' : 'Tassfya'}
          </span>
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-3 font-medium">{error}</p>
        )}

        <input
          type="email"
          placeholder={isArabic ? 'البريد الإلكتروني' : 'Email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 border rounded"
        />

        <div className="relative mb-3">
          <input
            type={show ? 'text' : 'password'}
            placeholder={isArabic ? 'كلمة المرور' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              isArabic ? 'left-3' : 'right-3'
            }`}
          >
            {show ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isArabic ? 'تسجيل الدخول' : 'Login'}
        </button>

        <div className="mt-4">
          <button
            onClick={() => setLang(isArabic ? 'en' : 'ar')}
            className="text-blue-600"
          >
            🌐 {isArabic ? 'English' : 'العربية'}
          </button>
        </div>
      </div>
    </div>
  );
}