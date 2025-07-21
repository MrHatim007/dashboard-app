import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import PrivateRoute from '../PrivateRoute'; // أو './PrivateRoute' حسب مكان الملف

export default function FulfillmentCenter() {
  const { lang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('fulfillmentOrders') || '[]').reverse();
    setOrders(stored);
  }, []);

  return (
      <PrivateRoute>
    <div dir={isArabic ? 'rtl' : 'ltr'} className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isArabic ? 'مركز تنفيذ الطلبات' : 'Fulfillment Center'}
      </h1>

      <div className="overflow-auto border rounded bg-white shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="p-3">{isArabic ? 'رقم الطلب' : 'Order ID'}</th>
              <th className="p-3">{isArabic ? 'التاريخ' : 'Date'}</th>
              <th className="p-3">{isArabic ? 'الحالة' : 'Status'}</th>
              <th className="p-3">{isArabic ? 'الموظف' : 'Employee'}</th>
              <th className="p-3">{isArabic ? 'المدينة' : 'City'}</th>
              <th className="p-3">{isArabic ? 'المبلغ' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t text-sm text-gray-800 hover:bg-gray-50"
              >
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">{order.status}</td>
                <td className="p-3">{order.employee}</td>
                <td className="p-3">{order.city}</td>
                <td className="p-3">${order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </PrivateRoute>
  );
}