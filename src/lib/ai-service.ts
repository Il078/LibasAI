/**
 * AI Service - Handles interactions with the AI API endpoints
 */

// Image Classification API
export async function classifyClothingItem(imageData: string): Promise<any> {
    try {
        const response = await fetch('/api/ai/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to classify clothing item:', error);
        throw error;
    }
}

// CLIP Embeddings API for visual similarity
export async function getImageEmbeddings(imageData: string): Promise<any> {
    try {
        console.log("Getting image embeddings for visual similarity");

        const response = await fetch('/api/ai/embed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageData,
                findSimilar: false
            }),
        });

        if (!response.ok) {
            console.error(`Embeddings API returned status ${response.status}`);
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Successfully received image embeddings:", {
            success: result.success,
            dimensions: result.data?.dimensions,
            source: result.data?.source || 'unknown'
        });

        return result;
    } catch (error) {
        console.error('Failed to get image embeddings:', error);
        throw error;
    }
}

// Style Matching API
export async function getOutfitMatches(baseItem: any, occasion?: string): Promise<any> {
    try {
        const response = await fetch('/api/ai/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                baseItem,
                occasion
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to get outfit matches:', error);
        throw error;
    }
}

// Personalized Recommendations API
export async function getPersonalizedRecommendations(
    userId: string,
    filters: { occasion?: string; season?: string; style?: string } = {}
): Promise<any> {
    try {
        const response = await fetch('/api/ai/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                ...filters
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to get personalized recommendations:', error);
        throw error;
    }
}

// Store Recommendations API
export async function getStoreRecommendations(
    params: { category?: string; style?: string; priceRange?: string } = {}
): Promise<any> {
    try {
        // Try the new endpoint first, fall back to the AI one if it fails
        const response = await fetch('/api/stores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            console.error(`Store recommendations API returned status ${response.status}`);

            // Try fallback endpoint
            console.log("Trying fallback endpoint /api/ai/stores");
            const fallbackResponse = await fetch('/api/ai/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!fallbackResponse.ok) {
                throw new Error(`All store API endpoints failed. Status: ${response.status}, ${fallbackResponse.status}`);
            }

            return await fallbackResponse.json();
        }

        const result = await response.json();
        console.log("Successfully received store recommendations:", {
            success: result.success,
            totalResults: result.data?.totalResults || 0
        });

        return result;
    } catch (error) {
        console.error('Failed to get store recommendations:', error);
        throw error;
    }
}

// Enhanced Product Recommendations API with visual similarity
export async function getProductRecommendations(
    params: {
        category?: string;
        color?: string;
        style?: string;
        pattern?: string;
        season?: string;
        storeId?: number;
        imageData?: string; // Optional base64 image for visual similarity
    } = {}
): Promise<any> {
    try {
        console.log("Calling enhanced product recommendations API with params:", {
            category: params.category,
            color: params.color,
            style: params.style,
            pattern: params.pattern,
            season: params.season,
            storeId: params.storeId,
            hasImageData: !!params.imageData
        });

        // Try the new endpoint first, fall back to the AI one if it fails
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            console.error(`Product recommendations API returned status ${response.status}`);

            // Try fallback endpoint
            console.log("Trying fallback endpoint /api/ai/products");
            const fallbackResponse = await fetch('/api/ai/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!fallbackResponse.ok) {
                throw new Error(`All product API endpoints failed. Status: ${response.status}, ${fallbackResponse.status}`);
            }

            return await fallbackResponse.json();
        }

        const result = await response.json();
        console.log("Successfully received product recommendations:", {
            success: result.success,
            totalResults: result.data?.totalResults || 0
        });

        return result;
    } catch (error) {
        console.error('Failed to get product recommendations:', error);
        throw error;
    }
} 