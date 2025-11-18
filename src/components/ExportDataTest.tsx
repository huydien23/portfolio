import React, { useState } from 'react';
import { Download, Upload, Database, Zap } from 'lucide-react';
import { exportStaticData, staticPortfolioData } from '../data/staticData';
import { useAdmin } from '../contexts/AdminContext';

const ExportDataTest: React.FC = () => {
  const { exportData, importData, loading } = useAdmin();
  const [importing, setImporting] = useState(false);

  const handleExportStatic = () => {
    try {
      exportStaticData();
      console.log('✅ Static data exported successfully');
    } catch (error) {
      console.error('❌ Export failed:', error);
    }
  };

  const handleExportFirebase = async () => {
    try {
      const data = await exportData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `firebase-data-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(link.href);
      console.log('✅ Firebase data exported successfully');
    } catch (error) {
      console.error('❌ Firebase export failed:', error);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      await importData(data);
      console.log('✅ Data imported successfully');
    } catch (error) {
      console.error('❌ Import failed:', error);
    }
  };

  const handleImportStatic = async () => {
    try {
      setImporting(true);
      await importData(staticPortfolioData);
      console.log('✅ Static data imported successfully to Firebase');
      alert('Dữ liệu tĩnh đã được import vào Firebase thành công!');
    } catch (error) {
      console.error('❌ Static import failed:', error);
      alert('Có lỗi xảy ra khi import dữ liệu!');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
        <Database className="w-5 h-5 mr-2" />
        Data Management Test
      </h2>
      
      <div className="space-y-4">
        {/* Export Static Data */}
        <div>
          <button
            onClick={handleExportStatic}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Static Data (JSON)
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Xuất dữ liệu tĩnh ban đầu để import vào Firebase
          </p>
        </div>

        {/* Export Firebase Data */}
        <div>
          <button
            onClick={handleExportFirebase}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'Exporting...' : 'Export Firebase Data'}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Xuất dữ liệu hiện tại từ Firebase
          </p>
        </div>

        {/* Import Static Data to Firebase */}
        <div>
          <button
            onClick={handleImportStatic}
            disabled={importing || loading}
            className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <Zap className="w-4 h-4 mr-2" />
            {importing ? 'Importing...' : 'Import Static Data to Firebase'}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Import dữ liệu tĩnh mặc định vào Firebase (seed data)
          </p>
        </div>
        <div>
          <label className="w-full flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Import Data to Firebase
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
              disabled={loading}
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Import dữ liệu JSON vào Firebase
          </p>
        </div>
      </div>

      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong>Hướng dẫn:</strong>
          <br />1. Export static data để có file JSON mẫu
          <br />2. Import file đó vào Firebase để seed data
          <br />3. Export Firebase data để backup
        </p>
      </div>
    </div>
  );
};

export default ExportDataTest;