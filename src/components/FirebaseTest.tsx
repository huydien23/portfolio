import React, { useEffect, useState } from 'react';
import { testFirebaseConnection, testDataOperations } from '../utils/testFirebase';

interface TestResult {
  database: boolean;
  analytics: boolean;
  dataOperations?: boolean;
  error?: string;
}

const FirebaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      // Test connection
      const connectionResult = await testFirebaseConnection();
      
      // Test data operations if database is working
      let dataOpsResult = false;
      if (connectionResult.database) {
        dataOpsResult = await testDataOperations();
      }

      setTestResult({
        ...connectionResult,
        dataOperations: dataOpsResult
      });
    } catch (error) {
      setTestResult({
        database: false,
        analytics: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        🔥 Firebase Connection Test
      </h2>
      
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Testing connections...</p>
        </div>
      )}

      {testResult && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Database:</span>
            <span className={`font-semibold ${
              testResult.database ? 'text-green-500' : 'text-red-500'
            }`}>
              {testResult.database ? '✅ Connected' : '❌ Failed'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Analytics:</span>
            <span className={`font-semibold ${
              testResult.analytics ? 'text-green-500' : 'text-red-500'
            }`}>
              {testResult.analytics ? '✅ Connected' : '❌ Failed'}
            </span>
          </div>

          {testResult.dataOperations !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Data Operations:</span>
              <span className={`font-semibold ${
                testResult.dataOperations ? 'text-green-500' : 'text-red-500'
              }`}>
                {testResult.dataOperations ? '✅ Working' : '❌ Failed'}
              </span>
            </div>
          )}

          {testResult.error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
              <p className="text-red-600 dark:text-red-400 text-sm">
                <strong>Error:</strong> {testResult.error}
              </p>
            </div>
          )}

          <button 
            onClick={runTests}
            className="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            Run Tests Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;