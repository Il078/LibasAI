'use client';

import React, { useState } from 'react';

export default function TestApi() {
    const [testResult, setTestResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const testClassifyApi = async () => {
        setIsLoading(true);
        setError('');
        try {
            // Create a simple base64 image (1x1 white pixel)
            const sampleImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

            const response = await fetch('/api/ai/classify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: sampleImage }),
            });

            const data = await response.json();
            setTestResult(JSON.stringify(data, null, 2));
        } catch (err) {
            console.error('Error testing API:', err);
            setError(`${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

            <button
                onClick={testClassifyApi}
                className="px-4 py-2 bg-[#4040a1] text-white rounded"
                disabled={isLoading}
            >
                {isLoading ? 'Testing...' : 'Test Classify API'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {testResult && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">API Response:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                        {testResult}
                    </pre>
                </div>
            )}
        </div>
    );
} 