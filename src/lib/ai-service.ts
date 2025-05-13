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

// Product Recommendations API
export async function getProductRecommendations(
    filters: {
        category?: string;
        color?: string;
        style?: string;
        pattern?: string;
        season?: string;
    } = {}
): Promise<any> {
    try {
        const response = await fetch('/api/ai/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to get product recommendations:', error);
        throw error;
    }
}

// Store Recommendations API
export async function getStoreRecommendations(
    preferences: { style?: string; budget?: string; location?: string } = {}
): Promise<any> {
    try {
        const response = await fetch('/api/ai/stores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferences),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to get store recommendations:', error);
        throw error;
    }
} 