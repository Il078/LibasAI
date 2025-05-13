// Simple script to test if our API endpoints are working
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3034'; // Use your current port

async function testAPIs() {
    console.log('===== Testing API Endpoints =====');

    try {
        // Test /api/products
        console.log('\nTesting /api/products...');
        const productsResponse = await fetch(`${BASE_URL}/api/products`);
        const productsJson = await productsResponse.json();
        console.log('Status:', productsResponse.status);
        console.log('Products found:', productsJson.data?.products?.length || 0);

        // Test /api/stores
        console.log('\nTesting /api/stores...');
        const storesResponse = await fetch(`${BASE_URL}/api/stores`);
        const storesJson = await storesResponse.json();
        console.log('Status:', storesResponse.status);
        console.log('Stores found:', storesJson.data?.stores?.length || 0);

        // Test POST to /api/products
        console.log('\nTesting POST to /api/products...');
        const productsPostResponse = await fetch(`${BASE_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: 'test' })
        });
        const productsPostJson = await productsPostResponse.json();
        console.log('Status:', productsPostResponse.status);
        console.log('Recommendations:', productsPostJson.data?.recommendations?.length || 0);

    } catch (error) {
        console.error('Error testing APIs:', error);
    }
}

testAPIs(); 