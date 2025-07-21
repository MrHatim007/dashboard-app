import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PrivateRoute from '../PrivateRoute';

export default function Orders() {
  const { lang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const sourcesSnap = await getDocs(collection(db, 'sheetSources'));
        const sheets = sourcesSnap.docs.map((doc) => doc.data());
        const allOrders = [];

        for (const sheet of sheets) {
          const sheetId = sheet.url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
          const apiKey = 'AIzaSyC5k650mb6xPoikEc3UK9G1yhFpIcBeB90';
          const range = 'Orders!A2:S';
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
          const res = await fetch(url);
          const data = await res.json();
          const rows = data.values || [];

          const ordersFromSheet = rows.map((row, index) => ({
            Price: row[0] || '',
            Total_Quantity: row[1] || '',
            Product_Name: row[2] || '',
            SKU: row[3] || '',
            Full_Name: row[4] || '',
            Full_Address: row[5] || '',
            Area: row[6] || '',
            City: row[7] || '',
            Phone: row[8] || '',
            Backup_Phone: row[9] || '',
            Order_ID: row[10] || `ID-${index}`,
            Email: row[11] || '',
            Currency: row[12] || '',
            Not_For_Driver: row[13] || '',
            Order_Link: row[14] || '',
            Order_Date: row[15]?.split('T')[0] || '',
            Extra1: row[16] || '',
            Extra2: row[17] || '',
            Status: row[18] || '',
          }));

          allOrders.push(...ordersFromSheet);
        }

        setOrders(allOrders);
      } catch (error) {
        console.error('Error loading orders:', error.message);
      }
    };

    fetchOrders();
  }, []);

  const handleChange = (key, value) => {
    setSelectedOrder((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdate = () => {
    setUpdating(true);
    const updated = orders.map(order =>
      order.Order_ID === selectedOrder.Order_ID ? selectedOrder : order
    );
    setOrders(updated);
    setSelectedOrder(null);
    setUpdating(false);
  };

  return (
    <PrivateRoute>
      <div dir={isArabic ? 'rtl' : 'ltr'} className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          {isArabic ? 'الطلبات' : 'Orders'}
        </h1>

        <div className="overflow-auto border rounded bg-white shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.Order_ID} className="border-t text-sm hover:bg-gray-50">
                  <td className="p-3">{order.Order_ID}</td>
                  <td className="p-3">{order.Price}</td>
                  <td className="p-3">{order.Total_Quantity}</td>
                  <td className="p-3">{order.Order_Date}</td>
                  <td className="p-3">{order.Status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* نافذة التعديل */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6 max-h-[90vh] overflow-y-auto">
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
                {Object.entries(selectedOrder).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-gray-500 text-xs">{key}</label>
                    {key === 'Status' ? (
                      <select
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="border rounded px-2 py-1 w-full text-sm"
                      >
                        <option value="">Select status</option>
                        <option value="✅ Confirmed">✅ Confirmed</option>
                        <option value="🚚 Processed">🚚 Processed</option>
                        <option value="❌ Cancelled">❌ Cancelled</option>
                        <option value="⌛ Expired">⌛ Expired</option>
                        <option value="✋ On hold">✋ On hold</option>
                        <option value="📞 Need to call back">📞 Need to call back</option>
                        <option value="✉️ Whatsapp Sent">✉️ Whatsapp Sent</option>
                        <option value="📦 Preparing">📦 Preparing</option>
                        <option value="❤️ Delivered">❤️ Delivered</option>
                        <option value="⏰ Out for Delivery">⏰ Out for Delivery</option>
                      </select>
                    ) : (
                      <input
                        className="border rounded px-2 py-1 w-full text-sm"
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={handleUpdate}
                  className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}