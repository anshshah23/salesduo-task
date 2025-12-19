import { useState } from 'react';
import './App.css';
import { api } from './services/api';
import { ProductResponse, AsinItem, HistoryItem } from './types';

function App() {
  const [asin, setAsin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [result, setResult] = useState<ProductResponse | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [asins, setAsins] = useState<AsinItem[]>([]);
  const [selectedAsin, setSelectedAsin] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOptimizingFurther, setIsOptimizingFurther] = useState(false);

  const handleOptimize = async () => {
    if (!asin.trim()) {
      setError('Please enter an ASIN');
      return;
    }

    setLoading(true);
    setError('');
    setWarning('');
    setResult(null);
    setIsOptimizingFurther(false);

    try {
      const response = await api.optimizeProduct(asin.trim());
      setResult(response);
      if (response.warning) {
        setWarning(response.warning);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to optimize product listing');
    } finally {
      setLoading(false);
    }
  };

  const handleShowHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getAllAsins();
      setAsins(response.data);
      setShowHistory(true);
    } catch (err: any) {
      setError('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAsin = async (selectedAsin: string) => {
    setLoading(true);
    setError('');
    setSelectedAsin(selectedAsin);
    try {
      const response = await api.getHistory(selectedAsin);
      setHistory(response.data);
    } catch (err: any) {
      setError('Failed to fetch ASIN history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = (item: HistoryItem, asin: string) => {
    // Display historical optimization in result view
    setResult({
      success: true,
      data: {
        asin: asin,
        original: {
          title: item.originalTitle || '',
          bulletPoints: item.originalBulletPoints || [],
          description: item.originalDescription || '',
          productDetails: item.productDetails || {}
        },
        optimized: {
          title: item.optimizedTitle,
          bulletPoints: item.optimizedBulletPoints,
          description: item.optimizedDescription,
          keywords: item.keywords
        }
      }
    });
    setShowHistory(false);
    setSelectedAsin(null);
    setIsOptimizingFurther(false);
  };

  const handleReOptimize = async (historyId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking re-optimize button
    setLoading(true);
    setError('');
    setWarning('');
    try {
      const response = await api.reOptimize(historyId);
      setResult(response);
      setShowHistory(false);
      setSelectedAsin(null);
      setIsOptimizingFurther(true);
      if (response.warning) {
        setWarning(response.warning);
      }
    } catch (err: any) {
      setError('Failed to re-optimize');
      console.error('Error re-optimizing:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Amazon Listing Optimizer
          </h1>
          <p className="text-gray-600">Powered by Gemini AI</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label htmlFor="asin-input" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Amazon ASIN
          </label>
          <div className="flex gap-3">
            <input
              id="asin-input"
              name="asin"
              type="text"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              placeholder="e.g., B07XYZ123"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleOptimize()}
            />
            <button
              onClick={handleOptimize}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Processing...' : 'Optimize'}
            </button>
            <button
              onClick={handleShowHistory}
              disabled={loading}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              History
            </button>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          {warning && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm">
              ⚠️ {warning}
            </div>
          )}
        </div>

        {result && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className={isOptimizingFurther ? "bg-blue-100 px-6 py-4 border-b" : "bg-gray-100 px-6 py-4 border-b"}>
                <h2 className={isOptimizingFurther ? "text-xl font-semibold text-blue-800" : "text-xl font-semibold text-gray-800"}>
                  {isOptimizingFurther ? '📝 Optimize Further' : 'Original Listing'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                  <p className="text-gray-900">
                    {isOptimizingFurther && result.data.previousOptimized 
                      ? result.data.previousOptimized.title 
                      : result.data.original.title}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Bullet Points</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {(isOptimizingFurther && result.data.previousOptimized 
                      ? result.data.previousOptimized.bulletPoints 
                      : result.data.original.bulletPoints).map((point, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-700 text-sm">
                    {isOptimizingFurther && result.data.previousOptimized 
                      ? result.data.previousOptimized.description 
                      : result.data.original.description}
                  </p>
                </div>
                {isOptimizingFurther && result.data.previousOptimized && result.data.previousOptimized.keywords && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.data.previousOptimized.keywords.map((keyword, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="bg-green-100 px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-green-800">
                  ✨ {isOptimizingFurther ? 'Further Optimized Listing' : 'Optimized Listing'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                  <p className="text-gray-900 font-medium">
                    {isOptimizingFurther && result.data.newOptimized 
                      ? result.data.newOptimized.title 
                      : result.data.optimized.title}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Bullet Points</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {(isOptimizingFurther && result.data.newOptimized 
                      ? result.data.newOptimized.bulletPoints 
                      : result.data.optimized.bulletPoints).map((point, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-700 text-sm">
                    {isOptimizingFurther && result.data.newOptimized 
                      ? result.data.newOptimized.description 
                      : result.data.optimized.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {(isOptimizingFurther && result.data.newOptimized 
                      ? result.data.newOptimized.keywords 
                      : result.data.optimized.keywords).map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedAsin ? `History for ${selectedAsin}` : 'Optimization History'}
                </h2>
                <button
                  onClick={() => {
                    setShowHistory(false);
                    setSelectedAsin(null);
                    setHistory([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
                {!selectedAsin ? (
                  // ASIN List
                  <div className="space-y-3">
                    {asins.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No optimization history yet</p>
                    ) : (
                      asins.map((item) => (
                        <div
                          key={item.asin}
                          onClick={() => handleSelectAsin(item.asin)}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{item.asin}</p>
                              <p className="text-sm text-gray-600 mt-1">{item.title}</p>
                            </div>
                            <div className="text-right ml-4">
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {item.optimizationCount} optimization{item.optimizationCount !== 1 ? 's' : ''}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(item.lastUpdated).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  // History for selected ASIN
                  <div>
                    <button
                      onClick={() => {
                        setSelectedAsin(null);
                        setHistory([]);
                      }}
                      className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to ASINs
                    </button>
                    
                    {history.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No optimization history for this ASIN</p>
                    ) : (
                      <div className="space-y-4">
                        {history.map((item) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleViewHistory(item, selectedAsin!)}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="text-xs text-gray-500">
                                  {new Date(item.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <button
                                onClick={(e) => handleReOptimize(item.id, e)}
                                disabled={loading}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400 transition"
                              >
                                Re-optimize from this
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-gray-500">Title</p>
                                <p className="text-sm text-gray-900">{item.optimizedTitle}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500">Bullet Points</p>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                  {item.optimizedBulletPoints.slice(0, 3).map((point, idx) => (
                                    <li key={idx}>{point.substring(0, 60)}...</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500">Keywords</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.keywords.map((keyword, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                                      {keyword}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;