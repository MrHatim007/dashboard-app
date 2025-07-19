import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const defaultPermissions = [
  { key: 'dashboard', ar: 'لوحة التحكم', en: 'Dashboard' },
  { key: 'orders', ar: 'الطلبات', en: 'Orders' },
  { key: 'employees', ar: 'الموظفون', en: 'Employees' },
  { key: 'ads', ar: 'الإعلانات', en: 'Ads' },
  { key: 'reports', ar: 'التقارير', en: 'Reports' },
  { key: 'settings', ar: 'الإعدادات', en: 'Settings' },
  { key: 'fulfillment', ar: 'مركز التجهيز', en: 'Fulfillment Center' },
];

export default function Employees() {
  const { lang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
    status: 'active',
    permissions: [],
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        const employeeList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeList);
      } catch (err) {
        console.error('Error loading employees:', err.message);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (key, value) => {
    const updated = { ...form, [key]: value };
    if (key === 'name') {
      const email = value.toLowerCase().replace(/\s+/g, '') + '@tassfya.com';
      updated.email = email;
    }
    if (key === 'role') {
      updated.permissions =
        value === 'admin'
          ? defaultPermissions.map((p) => p.key)
          : currentUser.role === 'admin'
          ? []
          : currentUser.permissions.filter((p) => p !== 'employees');
    }
    setForm(updated);
  };

  const togglePermission = (key) => {
    if (
      currentUser.role !== 'admin' &&
      (!currentUser.permissions.includes(key) || key === 'employees')
    )
      return;

    const updated = form.permissions.includes(key)
      ? form.permissions.filter((p) => p !== key)
      : [...form.permissions, key];

    setForm({ ...form, permissions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const target = employees.find((emp) => emp.id === editingId);
        if (
          currentUser.role !== 'admin' &&
          (target.role === 'admin' || target.email === currentUser.email)
        ) {
          alert(
            isArabic
              ? 'لا تملك صلاحية التعديل على هذا المستخدم'
              : 'You cannot edit this user'
          );
          return;
        }

        const { password, ...formWithoutPassword } = form;
        await setDoc(doc(db, 'employees', editingId), {
          ...formWithoutPassword,
          createdAt: new Date().toISOString(),
        });
        const updated = employees.map((emp) =>
          emp.id === editingId ? { id: editingId, ...formWithoutPassword } : emp
        );
        setEmployees(updated);
        setMessage(isArabic ? '✅ تم التعديل بنجاح' : '✅ Employee updated');
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const uid = userCredential.user.uid;

        const newEmployee = {
          name: form.name,
          email: form.email,
          role: 'agent',
          status: form.status,
          permissions:
            currentUser.role === 'admin'
              ? form.permissions
              : currentUser.permissions.filter(
                  (p) => p !== 'employees' && form.permissions.includes(p)
                ),
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'employees', uid), newEmployee);
        setEmployees([{ id: uid, ...newEmployee }, ...employees]);
        setMessage(isArabic ? '✅ تم الإضافة بنجاح' : '✅ Employee added');
      }

      setForm({
        name: '',
        email: '',
        password: '',
        role: 'agent',
        status: 'active',
        permissions: [],
      });
      setEditingId(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Firebase Error:', error.message);
      alert(isArabic ? 'حدث خطأ أثناء الحفظ' : 'Error saving employee');
    }
  };

  const handleEdit = (emp) => {
    if (
      currentUser.role !== 'admin' &&
      (emp.role === 'admin' || emp.email === currentUser.email)
    ) {
      alert(
        isArabic ? 'لا يمكنك تعديل هذا المستخدم' : 'You cannot edit this user'
      );
      return;
    }
    setForm({ ...emp, password: '' });
    setEditingId(emp.id);
  };

  const handleDelete = async (id, role) => {
    if (currentUser.role !== 'admin') return;
    if (
      window.confirm(isArabic ? 'هل أنت متأكد من الحذف؟' : 'Confirm delete?')
    ) {
      await deleteDoc(doc(db, 'employees', id));
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const canEdit = (emp) => {
    if (currentUser.role === 'admin') return true;
    if (emp.role === 'admin' || emp.email === currentUser.email) return false;
    return true;
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {isArabic ? 'الموظفون' : 'Employees'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded shadow mb-6"
      >
        <input
          type="text"
          placeholder={isArabic ? 'الاسم' : 'Name'}
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="email"
          value={form.email}
          className="p-2 border rounded"
          readOnly
        />
        {!editingId && (
          <input
            type="password"
            placeholder={isArabic ? 'كلمة المرور' : 'Password'}
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="p-2 border rounded"
            required
          />
        )}
        <select
          value={form.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="p-2 border rounded"
          disabled={currentUser.role !== 'admin'}
        >
          <option value="agent">{isArabic ? 'موظف' : 'Agent'}</option>
          <option value="admin" disabled={currentUser.role !== 'admin'}>
            {isArabic ? 'مدير' : 'Admin'}
          </option>
        </select>
        <select
          value={form.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="active">{isArabic ? 'مفعل' : 'Active'}</option>
          <option value="inactive">{isArabic ? 'غير مفعل' : 'Inactive'}</option>
        </select>

        <div className="col-span-2">
          <p className="font-semibold mb-2">
            {isArabic ? 'الصلاحيات:' : 'Permissions:'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {defaultPermissions.map((perm) => (
              <label key={perm.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.permissions.includes(perm.key)}
                  onChange={() => togglePermission(perm.key)}
                  disabled={
                    currentUser.role !== 'admin' &&
                    (!currentUser.permissions.includes(perm.key) ||
                      perm.key === 'employees')
                  }
                />
                {isArabic ? perm.ar : perm.en}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {editingId
            ? isArabic
              ? 'تحديث الموظف'
              : 'Update Employee'
            : isArabic
            ? 'إضافة الموظف'
            : 'Add Employee'}
        </button>
        {message && <p className="col-span-2 text-green-600">{message}</p>}
      </form>

      {employees.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">
            {isArabic ? 'قائمة الموظفين' : 'Employee List'}
          </h2>
          <table className="w-full bg-white rounded shadow text-sm overflow-x-auto">
            <thead>
              <tr className="bg-blue-200 text-gray-800">
                <th className="p-2">{isArabic ? 'الاسم' : 'Name'}</th>
                <th className="p-2">{isArabic ? 'البريد' : 'Email'}</th>
                <th className="p-2">{isArabic ? 'الدور' : 'Role'}</th>
                <th className="p-2">{isArabic ? 'الحالة' : 'Status'}</th>
                <th className="p-2">
                  {isArabic ? 'الصلاحيات' : 'Permissions'}
                </th>
                <th className="p-2">{isArabic ? 'الخيارات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="text-center border-t">
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2">{emp.email}</td>
                  <td className="p-2">{emp.role}</td>
                  <td className="p-2">{emp.status}</td>
                  <td className="p-2">
                    {emp.permissions?.map((p) => (
                      <span
                        key={p}
                        className="inline-block bg-gray-200 px-2 py-1 rounded text-xs m-0.5"
                      >
                        {isArabic
                          ? defaultPermissions.find((perm) => perm.key === p)
                              ?.ar
                          : defaultPermissions.find((perm) => perm.key === p)
                              ?.en}
                      </span>
                    ))}
                  </td>
                  <td className="p-2 flex justify-center gap-3">
                    {canEdit(emp) && (
                      <>
                        <button
                          onClick={() => handleEdit(emp)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit />
                        </button>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(emp.id, emp.role)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}