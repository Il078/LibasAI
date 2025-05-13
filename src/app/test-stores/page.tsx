'use client';

import React, { useState } from 'react';
import { getStoreRecommendations } from '@/lib/ai-service';

export default function TestStores() {
    const [storeResults, setStoreResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [category, setCategory] = useState('t-shirt');
    const [style, setStyle] = useState('casual');
    const [priceRange, setPriceRange] = useState('mid-range');

    const testStoresApi = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getStoreRecommendations({
                category,
                style,
                priceRange
            });

            setStoreResults(response);
        } catch (err) {
            console.error('Error testing API:', err);
            setError(`${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Stores API Test Page</h1>

            <div className="mb-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2 border rounded w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Style
                    </label>
                    <input
                        type="text"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="px-4 py-2 border rounded w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Range
                    </label>
                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="px-4 py-2 border rounded w-full"
                    >
                        <option value="budget">Budget</option>
                        <option value="mid-range">Mid-range</option>
                        <option value="premium">Premium</option>
                        <option value="luxury">Luxury</option>
                    </select>
                </div>
            </div>

            <button
                onClick={testStoresApi}
                className="px-4 py-2 bg-[#4040a1] text-white rounded"
                disabled={isLoading}
            >
                {isLoading ? 'Testing...' : 'Test Store Recommendations API'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {storeResults && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">API Response:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                        {JSON.stringify(storeResults, null, 2)}
                    </pre>

                    {storeResults.success && storeResults.data.recommendations && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4">Store Recommendations:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {storeResults.data.recommendations.map((store: any) => (
                                    <div key={store.id} className="border p-4 rounded">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold">{store.name}</h3>
                                            <span className="bg-[#4040a1] text-white px-2 py-1 rounded text-xs">
                                                {store.score}% match
                                            </span>
                                        </div>
                                        <p className="text-sm mt-2">{store.description}</p>
                                        <div className="mt-3 text-sm">
                                            <p><strong>Categories:</strong> {store.categories.join(', ')}</p>
                                            <p><strong>Styles:</strong> {store.styles.join(', ')}</p>
                                            <p><strong>Price Range:</strong> {store.priceRange}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 