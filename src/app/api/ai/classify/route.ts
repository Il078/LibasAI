import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: In production, you would properly handle API keys via environment variables
const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY || 'your-api-key';

// More detailed debug logging
console.log('Environment variables loaded:', {
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_VISION_API_KEY_SET: !!process.env.GOOGLE_VISION_API_KEY,
    GOOGLE_VISION_API_KEY_LENGTH: process.env.GOOGLE_VISION_API_KEY ? process.env.GOOGLE_VISION_API_KEY.length : 0,
    GOOGLE_VISION_API_KEY_PREFIX: process.env.GOOGLE_VISION_API_KEY ? process.env.GOOGLE_VISION_API_KEY.substring(0, 8) + '...' : 'not set'
});

// Debug: Log the API key status (but not the actual key for security)
console.log('Google Vision API Key status:', GOOGLE_VISION_API_KEY === 'your-api-key' ? 'Not configured' : 'Configured');

// Real clothing item classification using Google Vision API
async function classifyClothingItem(imageData: string) {
    try {
        console.log('Starting classification process');

        // Extract base64 data (remove the data:image/jpeg;base64, part if it exists)
        let base64Data = '';
        try {
            if (imageData.includes('base64,')) {
                base64Data = imageData.split('base64,')[1];
            } else {
                base64Data = imageData;
            }
            console.log('Base64 data extracted, length:', base64Data ? base64Data.length : 0);
        } catch (error) {
            console.error('Error extracting base64 data:', error);
            return mockClassification();
        }

        // Prepare request to Google Vision API - following the official format
        const visionRequest = {
            requests: [
                {
                    image: {
                        content: base64Data
                    },
                    features: [
                        {
                            type: 'LABEL_DETECTION',
                            maxResults: 10
                        },
                        {
                            type: 'OBJECT_LOCALIZATION',
                            maxResults: 5
                        },
                        {
                            type: 'IMAGE_PROPERTIES',
                            maxResults: 5
                        }
                    ]
                }
            ]
        };

        // For demo purposes, if no API key, use mock data
        if (GOOGLE_VISION_API_KEY === 'your-api-key') {
            console.log('Using mock data (no API key provided)');
            return mockClassification();
        }

        // Otherwise, make the actual API call
        console.log('Attempting to call Google Vision API with key prefix:', GOOGLE_VISION_API_KEY.substring(0, 8) + '...');
        console.log('API request body sample (first 100 chars):', JSON.stringify(visionRequest).substring(0, 100) + '...');

        try {
            const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(visionRequest)
            });

            console.log('Vision API Response Status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Vision API Error: ${response.status} - ${response.statusText}`, errorText);
                throw new Error(`Vision API Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Google Vision API response received (first 200 chars):', JSON.stringify(result).substring(0, 200) + '...');

            if (result.responses && result.responses[0].error) {
                console.error('Vision API returned an error:', result.responses[0].error);
                throw new Error(`Vision API returned: ${result.responses[0].error.message}`);
            }

            // Check if we got proper annotations
            const hasAnnotations =
                result.responses &&
                result.responses[0] &&
                (result.responses[0].labelAnnotations ||
                    result.responses[0].localizedObjectAnnotations);

            if (!hasAnnotations) {
                console.log('No annotations found in Vision API response, using mock data');
                return {
                    ...mockClassification(),
                    source: "mock-fallback" // Marking that we tried real API but had to fall back
                };
            }

            return {
                ...processVisionResponse(result),
                source: "google-vision"
            };
        } catch (error) {
            console.error('Error during Vision API fetch:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error in Vision API processing:', error);
        // Fallback to mock data if API fails
        console.log('Falling back to mock data due to error');
        return {
            ...mockClassification(),
            source: "mock-error-fallback"
        };
    }
}

// Process Google Vision API response
function processVisionResponse(visionResponse: any) {
    try {
        const labels = visionResponse.responses[0].labelAnnotations || [];
        const objects = visionResponse.responses[0].localizedObjectAnnotations || [];
        const colors = visionResponse.responses[0].imagePropertiesAnnotation?.dominantColors?.colors || [];

        // Extract clothing category
        let category = 'unknown';
        const clothingTypes = ['shirt', 't-shirt', 'dress', 'pants', 'jeans', 'skirt', 'jacket', 'sweater', 'blouse', 'shorts', 'coat'];

        // Check objects first (more accurate for clothing items)
        for (const obj of objects) {
            const name = obj.name.toLowerCase();
            if (clothingTypes.some(type => name.includes(type))) {
                category = name;
                break;
            }
        }

        // If no match in objects, check labels
        if (category === 'unknown') {
            for (const label of labels) {
                const desc = label.description.toLowerCase();
                if (clothingTypes.some(type => desc.includes(type))) {
                    category = desc;
                    break;
                }
            }
        }

        // Process colors
        let dominantColor = 'unknown';
        if (colors.length > 0) {
            // Get the color with highest score
            const topColor = colors[0].color;
            dominantColor = identifyColor(topColor.red, topColor.green, topColor.blue);
        }

        // Analyze patterns & materials from labels
        const patternKeywords = {
            'floral': ['floral', 'flower'],
            'striped': ['stripe', 'striped'],
            'checkered': ['check', 'plaid', 'tartan', 'checkered', 'gingham'],
            'dotted': ['dot', 'polka'],
            'solid': ['solid', 'plain']
        };

        const materialKeywords = {
            'cotton': ['cotton'],
            'denim': ['denim', 'jean'],
            'wool': ['wool', 'knit'],
            'silk': ['silk'],
            'leather': ['leather'],
            'polyester': ['polyester', 'synthetic']
        };

        const styleKeywords = {
            'casual': ['casual', 't-shirt', 'jeans', 'denim'],
            'formal': ['formal', 'business', 'suit', 'dress', 'elegant'],
            'athleisure': ['sport', 'athletic', 'gym', 'workout'],
            'vintage': ['vintage', 'retro'],
            'minimal': ['minimal', 'simple', 'basic']
        };

        // Find pattern, material and style by checking label descriptions
        let pattern = 'solid'; // Default
        let material = 'unknown';
        let style = 'casual';
        let confidence = 0;

        // Calculate overall confidence score
        if (labels.length > 0) {
            confidence = labels[0].score;
        }

        // Detect pattern, material and style from labels
        for (const label of labels) {
            const desc = label.description.toLowerCase();

            // Detect pattern
            for (const [patternName, keywords] of Object.entries(patternKeywords)) {
                if (keywords.some(keyword => desc.includes(keyword))) {
                    pattern = patternName;
                    break;
                }
            }

            // Detect material
            for (const [materialName, keywords] of Object.entries(materialKeywords)) {
                if (keywords.some(keyword => desc.includes(keyword))) {
                    material = materialName;
                    break;
                }
            }

            // Detect style
            for (const [styleName, keywords] of Object.entries(styleKeywords)) {
                if (keywords.some(keyword => desc.includes(keyword))) {
                    style = styleName;
                    break;
                }
            }
        }

        // Determine season based on category and material
        let season = 'all-season';
        if (category.includes('sweater') || category.includes('coat') || material === 'wool') {
            season = 'winter';
        } else if (category.includes('shorts') || category.includes('tank')) {
            season = 'summer';
        }

        return {
            category,
            attributes: {
                color: dominantColor,
                pattern,
                material: material !== 'unknown' ? material : 'cotton', // Default to cotton if unknown
                style,
                season
            },
            confidence: confidence.toFixed(2),
            source: "google-vision" // Mark as real data from Vision API
        };
    } catch (error) {
        console.error('Error processing Vision API response:', error);
        return mockClassification();
    }
}

// Helper function to identify color name from RGB
function identifyColor(r: number, g: number, b: number) {
    // Simple color identification based on RGB values
    const colors = [
        { name: 'black', r: 0, g: 0, b: 0 },
        { name: 'white', r: 255, g: 255, b: 255 },
        { name: 'red', r: 255, g: 0, b: 0 },
        { name: 'green', r: 0, g: 255, b: 0 },
        { name: 'blue', r: 0, g: 0, b: 255 },
        { name: 'yellow', r: 255, g: 255, b: 0 },
        { name: 'purple', r: 128, g: 0, b: 128 },
        { name: 'pink', r: 255, g: 192, b: 203 },
        { name: 'gray', r: 128, g: 128, b: 128 },
        { name: 'brown', r: 165, g: 42, b: 42 },
        { name: 'beige', r: 245, g: 245, b: 220 },
        { name: 'navy', r: 0, g: 0, b: 128 }
    ];

    // Calculate the Euclidean distance to each reference color
    let minDistance = Number.MAX_VALUE;
    let closestColor = 'unknown';

    for (const color of colors) {
        const distance = Math.sqrt(
            Math.pow(r - color.r, 2) +
            Math.pow(g - color.g, 2) +
            Math.pow(b - color.b, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = color.name;
        }
    }

    return closestColor;
}

// Mock classification for development or when API is unavailable
function mockClassification() {
    const categories = ['t-shirt', 'blouse', 'sweater', 'jacket', 'dress', 'pants', 'jeans', 'skirt', 'shorts'];
    const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'gray', 'brown'];
    const patterns = ['solid', 'striped', 'floral', 'checkered', 'dotted'];
    const materials = ['cotton', 'polyester', 'denim', 'silk', 'leather', 'wool'];
    const styles = ['casual', 'formal', 'business', 'athleisure', 'boho', 'vintage', 'minimal'];
    const seasons = ['spring', 'summer', 'fall', 'winter', 'all-season'];

    // Randomly select attributes for demo purposes
    const category = categories[Math.floor(Math.random() * categories.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const season = seasons[Math.floor(Math.random() * seasons.length)];

    // Generate a confidence score (0.5-1.0)
    const confidence = (0.5 + Math.random() * 0.5).toFixed(2);

    return {
        category,
        attributes: {
            color,
            pattern,
            material,
            style,
            season
        },
        confidence,
        source: "mock" // Explicitly mark as mock data
    };
}

// Simple temporary solution - let's create a debug info function
function createDebugResponse(result: any) {
    // Create a copy of the result
    const resultCopy = { ...result };

    // Add debug info
    const isMockData = result.source === "mock";

    return {
        success: true,
        data: resultCopy,
        debug: {
            usingMockData: isMockData,
            dataSource: result.source || "unknown"
        }
    };
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validate input
        if (!data.image) {
            return NextResponse.json(
                { error: 'No image data provided' },
                { status: 400 }
            );
        }

        console.log("Received image data, length:", data.image ? data.image.length : 0);

        // Process the image (base64 encoded string)
        const result = await classifyClothingItem(data.image);

        // Include debug information in the response
        return NextResponse.json({
            success: true,
            data: result,
            debug: {
                dataSource: result.source || 'unknown',
                usingMockData: result.source === 'mock' || result.source === 'mock-fallback' || result.source === 'mock-error-fallback',
                apiKeyConfigured: GOOGLE_VISION_API_KEY !== 'your-api-key',
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error classifying clothing item:', error);
        return NextResponse.json(
            {
                error: 'Failed to process image',
                debug: {
                    usingMockData: true,
                    errorMessage: error instanceof Error ? error.message : String(error),
                    timestamp: new Date().toISOString()
                }
            },
            { status: 500 }
        );
    }
} 