import React, { useContext, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

// بيانات ثابتة للاختبار
const allData = [
  { date: '2025-07-09', orders: 80, revenue: 10000, ads: 2800, cancelled: 4 },
  { date: '2025-07-10', orders: 60, revenue: 8000, ads: 2000, cancelled: 6 },
  { date: '2025-07-11', orders: 55, revenue: 7500, ads: 1800, cancelled: 8 },
  { date: '2025-07-12', orders: 50, revenue: 7000, ads: 1600, cancelled: 5 },
  { date: '2025-07-13', orders: 65, revenue: 8500, ads: 2300, cancelled: 7 },
  { date: '2025-07-14', orders: 75, revenue: 11000, ads: 3000, cancelled: 3 },
  { date: '2025-07-15', orders: 65, revenue: 9000, ads: 2500, cancelled: 7 },
];

export default function Reports() {
  const { lang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';

  const [filters, setFilters] = useState({
    from: '',
    to: '',
  });

  const filtered = allData.filter((d) => {
    const date = new Date(d.date);
    const from = filters.from ? new Date(filters.from) : null;
    const to = filters.to ? new Date(filters.to) : null;

    return (!from || date >= from) && (!to || date <= to);
  });

  const totals = filtered.reduce(
    (acc, item) => {
      acc.orders += item.orders;
      acc.revenue += item.revenue;
      acc.ads += item.ads;
      acc.cancelled += item.cancelled;
      return acc;
    },
    { orders: 0, revenue: 0, ads: 0, cancelled: 0 }
  );

  const chartData = {
    labels: ['Orders', 'Revenue', 'Ad Spend', 'Cancelled'],
    datasets: [
      {
        data: [totals.orders, totals.revenue, totals.ads, totals.cancelled],
        backgroundColor: ['#3b82f6', '#22c55e', '#facc15', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: filtered.map((d) => d.date),
    datasets: [
      {
        label: isArabic ? 'عدد الطلبات' : 'Orders Delivered',
        data: filtered.map((d) => d.orders),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        tension: 0.3,
      },
    ],
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {isArabic ? 'التقارير' : 'Reports'}
      </h1>

      {/* فلاتر */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          className="p-2 border rounded"
        />
        <button
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => setFilters({ from: '', to: '' })}
        >
          {isArabic ? 'إعادة ضبط' : 'Reset'}
        </button>
      </div>

      {/* كروت الأرقام */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          color="bg-blue-500"
          title="Total Orders"
          value={totals.orders}
          isArabic={isArabic}
        />
        <StatCard
          color="bg-green-500"
          title="Total Revenue"
          value={`$${totals.revenue.toLocaleString()}`}
          isArabic={isArabic}
        />
        <StatCard
          color="bg-yellow-500"
          title="Ad Spend"
          value={`$${totals.ads.toLocaleString()}`}
          isArabic={isArabic}
        />
        <StatCard
          color="bg-red-500"
          title="Cancelled"
          value={totals.cancelled}
          isArabic={isArabic}
        />
      </div>

      {/* مخطط دائري + بياني */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-center">
            {isArabic ? 'نظرة عامة' : 'Performance Overview'}
          </h2>
          <Doughnut data={chartData} />
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-center">
            {isArabic ? 'الطلبات اليومية' : 'Daily Orders'}
          </h2>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ color, title, value, isArabic }) {
  return (
    <div className={`p-4 rounded text-white shadow ${color}`}>
      <p className="text-sm">{isArabic ? translate(title) : title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function translate(key) {
  const map = {
    'Total Orders': 'إجمالي الطلبات',
    'Total Revenue': 'إجمالي الأرباح',
    'Ad Spend': 'مصاريف الإعلانات',
    Cancelled: 'الملغاة',
  };
  return map[key] || key;
}
