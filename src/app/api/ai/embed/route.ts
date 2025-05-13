import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: In production, use environment variables for API keys
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key';

// Debug: Log the API key status (but not the actual key for security)
console.log('OpenAI API Key status:', OPENAI_API_KEY === 'your-openai-api-key' ? 'Not configured' : 'Configured');

/**
 * This endpoint generates embeddings for clothing images using OpenAI's CLIP model
 * CLIP can understand visual concepts in natural language terms, making it perfect
 * for fashion applications
 */

// Generate CLIP embeddings from an image
async function generateEmbeddingsWithCLIP(imageData: string) {
    try {
        console.log('Starting CLIP embedding generation');

        // If no API key, use mock response
        if (OPENAI_API_KEY === 'your-openai-api-key') {
            console.log('Using mock embeddings (no OpenAI API key provided)');
            return {
                ...mockEmbeddings(),
                source: "mock"
            };
        }

        // Extract base64 data if needed
        let processedImageData = imageData;
        if (imageData.startsWith('data:')) {
            processedImageData = imageData; // Keep as is for base64 data URIs
        }

        // Make request to OpenAI API for embeddings using their latest format
        console.log('Calling OpenAI API for CLIP embeddings...');

        try {
            const response = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    input: [{
                        type: 'image_url',
                        image_url: {
                            url: processedImageData
                        }
                    }],
                    model: 'clip',
                    encoding_format: 'float'
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`OpenAI API Error: ${response.status} - ${response.statusText}`, errorText);
                throw new Error(`OpenAI API Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('OpenAI CLIP embeddings received successfully');

            return {
                success: true,
                embedding: result.data[0].embedding,
                dimensions: result.data[0].embedding.length,
                source: "openai-clip"
            };
        } catch (apiError) {
            console.error('Error calling OpenAI API:', apiError);
            throw apiError;
        }

    } catch (error) {
        console.error('Error in CLIP processing:', error);
        // Fallback to mock embeddings
        return {
            ...mockEmbeddings(),
            source: "mock-error-fallback"
        };
    }
}

// Provide mock embeddings for development or when API is unavailable
function mockEmbeddings() {
    // Generate a 512-dimensional embedding with random values between -1 and 1
    const dimensions = 512;
    const embedding = Array.from({ length: dimensions }, () => Math.random() * 2 - 1);

    return {
        success: true,
        embedding,
        dimensions,
        isMock: true // Flag to indicate this is mock data
    };
}

// Find similar items based on embedding similarity
function findSimilarItems(embedding: number[], threshold = 0.8) {
    // This would connect to a database of pre-computed embeddings
    // For now, we return mock similar items

    return [
        { id: 1, similarity: 0.95, category: 'dress', color: 'blue' },
        { id: 2, similarity: 0.92, category: 'dress', color: 'black' },
        { id: 3, similarity: 0.89, category: 'skirt', color: 'blue' },
        { id: 4, similarity: 0.85, category: 'blouse', color: 'white' },
        { id: 5, similarity: 0.82, category: 't-shirt', color: 'blue' }
    ].filter(item => item.similarity >= threshold);
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

        console.log('Received embedding request, image data length:', data.image.length);

        // Generate embeddings for the image
        const embeddingResult = await generateEmbeddingsWithCLIP(data.image);

        // Find similar items based on embedding
        const similarItems = data.findSimilar
            ? findSimilarItems(embeddingResult.embedding, data.threshold)
            : [];

        return NextResponse.json({
            success: true,
            data: {
                ...embeddingResult,
                similarItems: data.findSimilar ? similarItems : undefined
            }
        });

    } catch (error) {
        console.error('Error generating embeddings:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate embeddings',
                debug: {
                    message: error instanceof Error ? error.message : String(error),
                    usingMockData: true
                }
            },
            { status: 500 }
        );
    }
} 