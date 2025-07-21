import React, { useContext, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import PrivateRoute from '../PrivateRoute'; // أو './PrivateRoute' حسب مكان الملف

export default function AdCalculator() {
  const { lang } = useContext(LanguageContext);
  const isArabic = lang === 'ar';

  const [platform, setPlatform] = useState('');
  const [spend, setSpend] = useState('');
  const [cpc, setCpc] = useState('');
  const [conversionRate, setConversionRate] = useState('');
  const [salesRevenue, setSalesRevenue] = useState('');
  const [logs, setLogs] = useState([]);

  const spendNum = parseFloat(spend);
  const cpcNum = parseFloat(cpc);
  const conversionNum = parseFloat(conversionRate);
  const revenueNum = parseFloat(salesRevenue);

  const clicks = spendNum && cpcNum ? Math.floor(spendNum / cpcNum) : 0;
  const estimatedSales =
    clicks && conversionNum ? Math.floor(clicks * (conversionNum / 100)) : 0;
  const roas =
    spendNum && revenueNum ? (revenueNum / spendNum).toFixed(2) : null;
  const profit =
    spendNum && revenueNum ? (revenueNum - spendNum).toFixed(2) : null;

  const resetForm = () => {
    setPlatform('');
    setSpend('');
    setCpc('');
    setConversionRate('');
    setSalesRevenue('');
  };

  const handleSave = () => {
    if (!platform || !spend || !cpc || !salesRevenue) return;
    const now = new Date().toLocaleString();
    setLogs([
      {
        platform,
        spend,
        cpc,
        conversionRate,
        salesRevenue,
        clicks,
        estimatedSales,
        roas,
        profit,
        time: now,
      },
      ...logs,
    ]);
    resetForm();
  };

  return (
    <PrivateRoute>
    <div dir={isArabic ? 'rtl' : 'ltr'} className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isArabic ? 'تحليل أداء الإعلانات' : 'Ad Spending Analysis'}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">
            {isArabic ? 'اختر المنصة' : 'Select Platform'}
          </option>
          <option value="Facebook">Facebook</option>
          <option value="TikTok">TikTok</option>
          <option value="Snapchat">Snapchat</option>
        </select>

        <input
          type="number"
          placeholder={isArabic ? 'كم صرفت؟ ($)' : 'Ad Spend ($)'}
          value={spend}
          onChange={(e) => setSpend(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder={isArabic ? 'سعر النقرة ($)' : 'Cost per Click ($)'}
          value={cpc}
          onChange={(e) => setCpc(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder={isArabic ? 'نسبة التحويل (%)' : 'Conversion Rate (%)'}
          value={conversionRate}
          onChange={(e) => setConversionRate(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder={isArabic ? 'إجمالي المبيعات ($)' : 'Total Sales ($)'}
          value={salesRevenue}
          onChange={(e) => setSalesRevenue(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          💾 {isArabic ? 'حفظ الحساب' : 'Save Calculation'}
        </button>
        <button
          onClick={resetForm}
          className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
        >
          🔄 {isArabic ? 'تصفير' : 'Reset'}
        </button>
      </div>

      {roas && (
        <div className="bg-white rounded-xl shadow mb-6 p-6 space-y-3">
          <p className="text-lg">
            📌 <strong>{isArabic ? 'النقرات' : 'Clicks'}:</strong> {clicks}
          </p>
          <p className="text-lg">
            📦{' '}
            <strong>
              {isArabic ? 'الطلبات المتوقعة' : 'Estimated Orders'}:
            </strong>{' '}
            {estimatedSales}
          </p>
          <p className="text-lg">
            💰 <strong>{isArabic ? 'الربح' : 'Profit'}:</strong>{' '}
            <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
              ${profit}
            </span>
          </p>
          <p className="text-lg">
            📊 <strong>{isArabic ? 'ROAS' : 'ROAS'}:</strong>{' '}
            <span className="font-bold">{roas}x</span>
          </p>
        </div>
      )}

      {logs.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold mb-4">
            {isArabic ? 'سجل الحسابات المحفوظة' : 'Saved Calculations Log'}
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">{isArabic ? 'المنصة' : 'Platform'}</th>
                <th className="p-2">{isArabic ? 'الصرف ($)' : 'Spend ($)'}</th>
                <th className="p-2">
                  {isArabic ? 'المبيعات ($)' : 'Sales ($)'}
                </th>
                <th className="p-2">{isArabic ? 'الربح' : 'Profit'}</th>
                <th className="p-2">{isArabic ? 'ROAS' : 'ROAS'}</th>
                <th className="p-2">{isArabic ? 'الوقت' : 'Time'}</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{log.platform}</td>
                  <td className="p-2">${log.spend}</td>
                  <td className="p-2">${log.salesRevenue}</td>
                  <td
                    className="p-2"
                    style={{ color: log.profit >= 0 ? 'green' : 'red' }}
                  >
                    ${log.profit}
                  </td>
                  <td className="p-2">{log.roas}x</td>
                  <td className="p-2">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </PrivateRoute>
  );
}
