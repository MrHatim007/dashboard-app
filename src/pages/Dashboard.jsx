import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const STATUS_ORDER = [
  'Total Orders',
  'New Order',
  '❤️ Delivered',
  '✅ Confirmed',
  '🚚 Processed',
  '❌ Cancelled',
  '⏰ Out for Delivery',
  '⌛ Expired',
  '✋ On hold',
  '📞 Need to call back',
  '✉️ Whatsapp Sent',
  '📦 Preparing',
  'Total Revenue',
];

const STATUS_KEYS = {
  'New Order': 'New Order',
  '❤️ Delivered': '❤️ Delivered',
  '✅ Confirmed': '✅ Confirmed',
  '🚚 Processed': '🚚 Processed',
  '❌ Cancelled': '❌ Cancelled',
  '⏰ Out for Delivery': '⏰ Out for Delivery',
  '⌛ Expired': '⌛ Expired',
  '✋ On hold': '✋ On hold',
  '📞 Need to call back': '📞 Need to call back',
  '✉️ Whatsapp Sent': '✉️ Whatsapp Sent',
  '📦 Preparing': '📦 Preparing',
};

const STATUS_COLORS = {
  'New Order': 'from-gray-400 to-gray-600',
  '❤️ Delivered': 'from-rose-500 to-rose-700',
  '✅ Confirmed': 'from-green-500 to-green-700',
  '🚚 Processed': 'from-blue-500 to-blue-700',
  '❌ Cancelled': 'from-red-500 to-red-700',
  '⏰ Out for Delivery': 'from-yellow-600 to-yellow-800',
  '⌛ Expired': 'from-yellow-400 to-yellow-600',
  '✋ On hold': 'from-orange-500 to-orange-700',
  '📞 Need to call back': 'from-purple-500 to-purple-700',
  '✉️ Whatsapp Sent': 'from-pink-500 to-pink-700',
  '📦 Preparing': 'from-indigo-500 to-indigo-700',
};

export default function Dashboard() {
  const { lang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    location: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const sourcesSnap = await getDocs(collection(db, 'sheetSources'));
        const sheets = sourcesSnap.docs.map((doc) => doc.data());
        const allOrders = [];

        for (const sheet of sheets) {
          const sheetId = sheet.url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
          const apiKey = 'AIzaSyC5k650mb6xPoikEc3UK9G1yhFpIcBeB90';
          const range = 'Orders!A2:T';
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
          const res = await fetch(url);
          const data = await res.json();
          const rows = data.values || [];

          const ordersFromSheet = rows.map((row, index) => ({
            id: row[10] || `ID-${index}`,
            date: row[15]?.split('T')[0] || '',
            status: row[18] || '',
            location: row[7] || '',
            revenue: parseFloat(row[0]) || 0,
          }));

          allOrders.push(...ordersFromSheet);
        }

        setOrders(allOrders);
      } catch (error) {
        console.error('Error loading orders:', error.message);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const resetFilters = () =>
    setFilters({ status: '', location: '', dateFrom: '', dateTo: '' });

  const filtered = orders.filter((order) => {
    const matchStatus = filters.status ? order.status === filters.status : true;
    const matchLocation = filters.location
      ? order.location === filters.location
      : true;
    const matchDateFrom = filters.dateFrom
      ? order.date >= filters.dateFrom
      : true;
    const matchDateTo = filters.dateTo ? order.date <= filters.dateTo : true;
    return matchStatus && matchLocation && matchDateFrom && matchDateTo;
  });

  const statusCounts = {};
  Object.keys(STATUS_KEYS).forEach((key) => {
    statusCounts[key] = filtered.filter((o) => o.status === key).length;
  });

  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((sum, o) => sum + o.revenue, 0);

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isArabic ? 'لوحة التحكم' : 'Dashboard'}
      </h1>

      {loading ? (
        <p>{isArabic ? 'جارٍ التحميل...' : 'Loading...'}</p>
      ) : (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <select
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              value={filters.status}
              className="p-2 border rounded"
            >
              <option value="">
                {isArabic ? 'كل الحالات' : 'All Statuses'}
              </option>
              {Object.entries(STATUS_KEYS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              value={filters.location}
              className="p-2 border rounded"
            >
              <option value="">{isArabic ? 'كل المدن' : 'All Cities'}</option>
              {[...new Set(orders.map((o) => o.location))].map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </select>
            <input
              type="date"
              className="p-2 border rounded"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
            />
            <input
              type="date"
              className="p-2 border rounded"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
            />
            <button
              onClick={resetFilters}
              className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded"
            >
              {isArabic ? 'تصفير الفلاتر' : 'Reset Filters'}
            </button>
          </div>

          {/* Ordered Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATUS_ORDER.map((key) => {
              if (key === 'Total Orders') {
                return (
                  !filters.status && (
                    <StatusCard
                      key="total"
                      title={isArabic ? 'إجمالي الطلبات' : key}
                      value={totalOrders}
                      color="from-blue-800 to-blue-900"
                    />
                  )
                );
              }
              if (key === 'Total Revenue') {
                return (
                  <StatusCard
                    key="revenue"
                    title={isArabic ? 'إجمالي الأرباح' : key}
                    value={`AED ${totalRevenue}`}
                    color="from-green-700 to-green-900"
                  />
                );
              }

              const shouldDisplay = !filters.status || filters.status === key;
              return (
                shouldDisplay && (
                  <StatusCard
                    key={key}
                    title={key}
                    value={statusCounts[key] || 0}
                    color={STATUS_COLORS[key] || 'from-gray-500 to-gray-700'}
                  />
                )
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function StatusCard({ title, value, color }) {
  return (
    <div
      className={`text-white p-5 rounded-xl shadow-md bg-gradient-to-r ${color} hover:scale-105 transition`}
    >
      <div className="text-sm opacity-90 mb-1">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
