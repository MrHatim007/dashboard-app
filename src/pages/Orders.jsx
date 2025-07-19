// داخل Orders.jsx
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbwPLF9W88BXjLp_a444T57M_05T7GJWN8Y59SP0O4b2QVogHw8O2aUb6o9rwS2GCinlgA/exec';

export default function Orders() {
  const { lang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snap = await getDocs(collection(db, 'sheetSources'));
        if (!snap.empty) {
          const first = snap.docs[0].data();
          const sheetId = first.url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
          const apiKey = 'AIzaSyC5k650mb6xPoikEc3UK9G1yhFpIcBeB90';
          const range = 'Orders!A1:Z';
          const res = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
          );
          const json = await res.json();
          const [headers, ...rows] = json.values || [];
          const index = (title) => headers.indexOf(title);
          const parsed = rows.map((row, i) => ({
            id: row[index('Order ID')] || `row${i}`,
            price: row[index('Price')] || '',
            quantity: row[index('Total quantity')] || '',
            product: row[index('Product name')] || '',
            fullName: row[index('Full name')] || '',
            address: row[index('Full address')] || '',
            area: row[index('Area')] || '',
            city: row[index('City')] || '',
            phone: row[index('Phone')] || '',
            backupPhone: row[index('Back up phone')] || '',
            email: row[index('Email')] || '',
            currency: row[index('Currency')] || '',
            note: row[index('Note for driver')] || '',
            link: row[index('Order Link')] || '',
            date: row[index('Order date')]?.split('T')[0] || '',
            status: row[index('Status')] || '',
          }));
          setOrders(parsed);
        }
      } catch (err) {
        console.error('Error fetching orders:', err.message);
      }
    };

    fetchOrders();
  }, []);

  const handleChange = (key, value) => {
    setSelectedOrder((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(selectedOrder),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      if (result.success) {
        alert('✅ Order updated');
        setSelectedOrder(null);
      } else {
        alert('❌ Failed to update order');
      }
    } catch (err) {
      console.error('Error updating:', err);
      alert('❌ Error occurred while updating');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isArabic ? 'الطلبات' : 'Orders'}
      </h1>

      {/* Table */}
      <div className="overflow-auto border rounded bg-white shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Total Quantity</th>
              <th className="p-3 text-left">Order Date</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t text-sm text-gray-800 hover:bg-gray-50"
              >
                <td className="p-3">{order.id}</td>
                <td className="p-3">AED {order.price}</td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3 flex items-center gap-2">
                  {order.status}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Order</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-600 hover:text-black text-lg"
              >
                ✖
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                ['Full Name', 'fullName'],
                ['Phone', 'phone'],
                ['Back up Phone', 'backupPhone'],
                ['Price', 'price'],
                ['Total Quantity', 'quantity'],
                ['Product Name', 'product'],
                ['Full Address', 'address'],
                ['Area', 'area'],
                ['City', 'city'],
                ['Order ID', 'id'],
                ['Email', 'email'],
                ['Currency', 'currency'],
                ['Note for Driver', 'note'],
                ['Order Link', 'link'],
                ['Order Date', 'date'],
                ['Status', 'status'],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="text-gray-500 text-xs">{label}</label>
                  <input
                    className="border rounded px-2 py-1 w-full text-sm"
                    value={selectedOrder[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
