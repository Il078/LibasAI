// Debug Test Script for Google Vision API
const https = require('https');
const fs = require('fs');

console.log('===== STARTING DEBUG TEST =====');

// Use the API key
const API_KEY = 'AIzaSyDeB8ZFno22pqFAL6M2NTlaF6l9jKZCRas';

// Two options for image input:
// 1. Use a sample base64 image
// 2. If you have a real image file, convert it to base64

// Option 1: Sample base64 data (the actual value should be much longer)
// Note: This is a minimal base64 encoded image - Vision API may need a real image
const sampleBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

// Use proper base64 format - just the data part, no data URI prefix
const IMAGE_CONTENT = sampleBase64;

console.log('API Key (first 8 chars):', API_KEY.substring(0, 8) + '...');
console.log('Image data length:', IMAGE_CONTENT.length);

// Prepare the request according to Google Cloud Vision API docs
const requestData = JSON.stringify({
    requests: [
        {
            image: {
                content: IMAGE_CONTENT
            },
            features: [
                { type: 'LABEL_DETECTION', maxResults: 5 },
                { type: 'OBJECT_LOCALIZATION', maxResults: 5 },
                { type: 'IMAGE_PROPERTIES', maxResults: 5 }
            ]
        }
    ]
});

const options = {
    hostname: 'vision.googleapis.com',
    path: `/v1/images:annotate?key=${API_KEY}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': requestData.length
    }
};

console.log('\nMaking request to Google Vision API...');
console.log('Request URL:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
    console.log(`\nStatus Code: ${res.statusCode}`);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));

    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
        console.log('Received chunk of data, size:', chunk.length);
    });

    res.on('end', () => {
        console.log('\nResponse received, total size:', data.length);
        try {
            const parsedData = JSON.parse(data);
            console.log('Parsed response:');
            console.log(JSON.stringify(parsedData, null, 2));

            // Check if there's an error
            if (parsedData.responses && parsedData.responses[0].error) {
                console.error('\nAPI returned an error:', parsedData.responses[0].error);
            } else {
                console.log('\nAPI call successful!');

                // Check for label annotations
                if (parsedData.responses && parsedData.responses[0].labelAnnotations) {
                    console.log('\nDetected labels:');
                    parsedData.responses[0].labelAnnotations.forEach(label => {
                        console.log(`- ${label.description} (${Math.round(label.score * 100)}% confidence)`);
                    });
                }
            }
        } catch (e) {
            console.error('\nError parsing JSON:', e);
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('\nError making API request:', error);
});

// Send the request
req.write(requestData);
req.end();

console.log('Request sent, waiting for response...'); 