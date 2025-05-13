'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getProductRecommendations } from '@/lib/ai-service';

export default function TestProducts() {
    const [productResults, setProductResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [category, setCategory] = useState('t-shirt');
    const [color, setColor] = useState('white');
    const [style, setStyle] = useState('casual');
    const [pattern, setPattern] = useState('solid');
    const [season, setSeason] = useState('all-season');

    const testProductsApi = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await getProductRecommendations({
                category,
                color,
                style,
                pattern,
                season
            });

            setProductResults(response);
        } catch (err) {
            console.error('Error testing API:', err);
            setError(`${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Products API Test Page</h1>

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
                        Color
                    </label>
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
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
                        Pattern
                    </label>
                    <input
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        className="px-4 py-2 border rounded w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Season
                    </label>
                    <select
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="px-4 py-2 border rounded w-full"
                    >
                        <option value="all-season">All Seasons</option>
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                        <option value="fall">Fall</option>
                        <option value="winter">Winter</option>
                    </select>
                </div>
            </div>

            <button
                onClick={testProductsApi}
                className="px-4 py-2 bg-[#4040a1] text-white rounded"
                disabled={isLoading}
            >
                {isLoading ? 'Testing...' : 'Test Product Recommendations API'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {productResults && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">API Response:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-48">
                        {JSON.stringify(productResults, null, 2)}
                    </pre>

                    {productResults.success && productResults.data.recommendations && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4">Product Recommendations:</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {productResults.data.recommendations.map((product: any) => (
                                    <div key={product.id} className="border rounded overflow-hidden">
                                        <div className="relative h-60 w-full bg-gray-100">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <div className="absolute top-2 right-2 bg-[#4040a1] text-white py-1 px-2 rounded-full text-xs font-bold">
                                                {product.match_score}% match
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold">{product.name}</h3>
                                            <div className="flex justify-between mt-2">
                                                <span className="text-sm">${product.price}</span>
                                                <span className="text-sm">{product.storeName}</span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                <span className="bg-gray-100 px-2 py-1 text-xs rounded">{product.category}</span>
                                                <span className="bg-gray-100 px-2 py-1 text-xs rounded">{product.color}</span>
                                                <span className="bg-gray-100 px-2 py-1 text-xs rounded">{product.material}</span>
                                                <span className="bg-gray-100 px-2 py-1 text-xs rounded">{product.pattern}</span>
                                            </div>
                                            <a
                                                href={product.productUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 block text-center py-2 bg-[#4040a1] text-white text-sm rounded hover:bg-[#333380] transition-colors"
                                            >
                                                View Product
                                            </a>
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