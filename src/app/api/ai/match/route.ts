import { NextRequest, NextResponse } from 'next/server';

// Mock database of clothing items (in a real app this would be in a database)
const clothingItems = [
    { id: 1, category: 'jeans', color: 'blue', pattern: 'solid', material: 'denim', style: 'casual', season: 'all-season' },
    { id: 2, category: 't-shirt', color: 'white', pattern: 'solid', material: 'cotton', style: 'casual', season: 'summer' },
    { id: 3, category: 'blouse', color: 'red', pattern: 'floral', material: 'silk', style: 'formal', season: 'spring' },
    { id: 4, category: 'sweater', color: 'gray', pattern: 'solid', material: 'wool', style: 'casual', season: 'winter' },
    { id: 5, category: 'jacket', color: 'black', pattern: 'solid', material: 'leather', style: 'casual', season: 'fall' },
    { id: 6, category: 'dress', color: 'blue', pattern: 'floral', material: 'cotton', style: 'casual', season: 'summer' },
    { id: 7, category: 'skirt', color: 'black', pattern: 'solid', material: 'polyester', style: 'formal', season: 'all-season' },
    { id: 8, category: 'shorts', color: 'beige', pattern: 'solid', material: 'cotton', style: 'casual', season: 'summer' },
    { id: 9, category: 'pants', color: 'gray', pattern: 'solid', material: 'polyester', style: 'business', season: 'all-season' },
    { id: 10, category: 'jacket', color: 'navy', pattern: 'solid', material: 'wool', style: 'business', season: 'winter' },
    { id: 11, category: 't-shirt', color: 'black', pattern: 'solid', material: 'cotton', style: 'casual', season: 'all-season' },
    { id: 12, category: 'jeans', color: 'black', pattern: 'solid', material: 'denim', style: 'casual', season: 'all-season' },
    { id: 13, category: 'blouse', color: 'white', pattern: 'solid', material: 'silk', style: 'formal', season: 'all-season' },
    { id: 14, category: 'sweater', color: 'beige', pattern: 'cable-knit', material: 'wool', style: 'casual', season: 'winter' },
    { id: 15, category: 'dress', color: 'black', pattern: 'solid', material: 'polyester', style: 'formal', season: 'all-season' },
];

// Style matching algorithm (simulated)
async function findMatchingItems(baseItem: any, occasion: string) {
    // Simulate processing time for AI
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Define compatible categories based on the base item
    const categoryMatches: Record<string, string[]> = {
        't-shirt': ['jeans', 'shorts', 'skirt', 'jacket'],
        'blouse': ['jeans', 'skirt', 'pants'],
        'sweater': ['jeans', 'pants', 'skirt'],
        'jacket': ['t-shirt', 'blouse', 'jeans', 'pants', 'dress'],
        'dress': ['jacket'],
        'pants': ['t-shirt', 'blouse', 'sweater', 'jacket'],
        'jeans': ['t-shirt', 'blouse', 'sweater', 'jacket'],
        'skirt': ['t-shirt', 'blouse', 'sweater', 'jacket'],
        'shorts': ['t-shirt']
    };

    // Get compatible categories for the base item
    const compatibleCategories = categoryMatches[baseItem.category] || [];

    // Filter items by compatible categories and season
    let matchingItems = clothingItems.filter(item =>
        compatibleCategories.includes(item.category) &&
        (item.season === baseItem.attributes.season || item.season === 'all-season' || baseItem.attributes.season === 'all-season')
    );

    // Further filter by style preference if provided
    if (occasion) {
        // Give higher rank to items that match the occasion
        matchingItems = matchingItems.map(item => ({
            ...item,
            match_score: calculateMatchScore(item, baseItem, occasion)
        }));
    } else {
        // Default scoring without occasion
        matchingItems = matchingItems.map(item => ({
            ...item,
            match_score: calculateMatchScore(item, baseItem)
        }));
    }

    // Sort by match score (highest first)
    return matchingItems.sort((a, b) => b.match_score - a.match_score);
}

// Calculate match score between two items (simulated algorithm)
function calculateMatchScore(item: any, baseItem: any, occasion?: string) {
    let score = 60; // Base score

    // Color harmony bonuses
    const complementaryColors: Record<string, string[]> = {
        'black': ['white', 'red', 'blue', 'pink'],
        'white': ['black', 'blue', 'red', 'navy'],
        'blue': ['white', 'beige', 'gray'],
        'red': ['black', 'white', 'beige'],
        'green': ['white', 'beige', 'black'],
        'yellow': ['blue', 'purple', 'gray'],
        'purple': ['yellow', 'white', 'gray'],
        'pink': ['black', 'gray', 'navy'],
        'gray': ['blue', 'pink', 'red', 'navy'],
        'brown': ['beige', 'blue', 'white'],
        'beige': ['blue', 'brown', 'black', 'red'],
        'navy': ['white', 'beige', 'pink']
    };

    // Add color harmony bonus
    if (complementaryColors[baseItem.attributes.color]?.includes(item.color)) {
        score += 15;
    }

    // Add style consistency bonus
    if (item.style === baseItem.attributes.style) {
        score += 10;
    }

    // Add occasion bonus if provided
    if (occasion && item.style === occasion) {
        score += 15;
    }

    // Slight randomization to make results more interesting
    score += Math.floor(Math.random() * 10);

    // Cap the score at 100
    return Math.min(score, 100);
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validate input
        if (!data.baseItem) {
            return NextResponse.json(
                { error: 'No base item provided' },
                { status: 400 }
            );
        }

        // Get the occasion from the request (optional)
        const occasion = data.occasion || null;

        // Find matching items
        const matches = await findMatchingItems(data.baseItem, occasion);

        return NextResponse.json({
            success: true,
            data: {
                baseItem: data.baseItem,
                matches: matches.slice(0, 6) // Return top 6 matches
            }
        });

    } catch (error) {
        console.error('Error finding matching items:', error);
        return NextResponse.json(
            { error: 'Failed to find matching items' },
            { status: 500 }
        );
    }
} 