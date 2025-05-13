import { NextRequest, NextResponse } from 'next/server';

// Mock user preference data (in a real app this would be stored in a database)
interface StylePreference {
    colors: string[];
    patterns: string[];
    styles: string[];
    occasions: string[];
    seasons: string[];
}

interface User {
    id: string;
    name: string;
    stylePreferences: StylePreference;
}

// Mock outfits database
interface OutfitItem {
    id: number;
    type: string;
    category: string;
    color: string;
    pattern: string;
    style: string;
    season: string;
    imageUrl: string;
}

interface Outfit {
    id: number;
    name: string;
    occasion: string;
    items: OutfitItem[];
    season: string;
    style: string;
}

// Mock users
const users: Record<string, User> = {
    'user123': {
        id: 'user123',
        name: 'Demo User',
        stylePreferences: {
            colors: ['black', 'white', 'blue', 'gray'],
            patterns: ['solid', 'minimal'],
            styles: ['casual', 'minimal', 'business'],
            occasions: ['work', 'casual', 'weekend'],
            seasons: ['fall', 'winter']
        }
    },
    'user456': {
        id: 'user456',
        name: 'Fashion User',
        stylePreferences: {
            colors: ['vibrant', 'red', 'yellow', 'green'],
            patterns: ['floral', 'graphic', 'bold'],
            styles: ['bohemian', 'streetwear'],
            occasions: ['party', 'festival', 'travel'],
            seasons: ['spring', 'summer']
        }
    }
};

// Mock outfit database
const outfits: Outfit[] = [
    {
        id: 1,
        name: 'Business Casual',
        occasion: 'work',
        season: 'all-season',
        style: 'business',
        items: [
            { id: 101, type: 'top', category: 'shirt', color: 'white', pattern: 'solid', style: 'business', season: 'all-season', imageUrl: '/outfit-placeholders/white-shirt.jpg' },
            { id: 102, type: 'bottom', category: 'pants', color: 'navy', pattern: 'solid', style: 'business', season: 'all-season', imageUrl: '/outfit-placeholders/navy-pants.jpg' },
            { id: 103, type: 'footwear', category: 'shoes', color: 'brown', pattern: 'solid', style: 'business', season: 'all-season', imageUrl: '/outfit-placeholders/brown-shoes.jpg' },
        ]
    },
    {
        id: 2,
        name: 'Weekend Casual',
        occasion: 'casual',
        season: 'fall',
        style: 'casual',
        items: [
            { id: 201, type: 'top', category: 't-shirt', color: 'gray', pattern: 'solid', style: 'casual', season: 'all-season', imageUrl: '/outfit-placeholders/gray-tshirt.jpg' },
            { id: 202, type: 'bottom', category: 'jeans', color: 'blue', pattern: 'solid', style: 'casual', season: 'all-season', imageUrl: '/outfit-placeholders/blue-jeans.jpg' },
            { id: 203, type: 'outerwear', category: 'jacket', color: 'black', pattern: 'solid', style: 'casual', season: 'fall', imageUrl: '/outfit-placeholders/black-jacket.jpg' },
            { id: 204, type: 'footwear', category: 'sneakers', color: 'white', pattern: 'solid', style: 'casual', season: 'all-season', imageUrl: '/outfit-placeholders/white-sneakers.jpg' },
        ]
    },
    {
        id: 3,
        name: 'Summer Party',
        occasion: 'party',
        season: 'summer',
        style: 'bohemian',
        items: [
            { id: 301, type: 'dress', category: 'sundress', color: 'yellow', pattern: 'floral', style: 'bohemian', season: 'summer', imageUrl: '/outfit-placeholders/yellow-dress.jpg' },
            { id: 302, type: 'footwear', category: 'sandals', color: 'brown', pattern: 'solid', style: 'bohemian', season: 'summer', imageUrl: '/outfit-placeholders/brown-sandals.jpg' },
            { id: 303, type: 'accessory', category: 'hat', color: 'beige', pattern: 'solid', style: 'bohemian', season: 'summer', imageUrl: '/outfit-placeholders/beige-hat.jpg' },
        ]
    },
    {
        id: 4,
        name: 'Winter Minimal',
        occasion: 'casual',
        season: 'winter',
        style: 'minimal',
        items: [
            { id: 401, type: 'top', category: 'sweater', color: 'black', pattern: 'solid', style: 'minimal', season: 'winter', imageUrl: '/outfit-placeholders/black-sweater.jpg' },
            { id: 402, type: 'bottom', category: 'pants', color: 'black', pattern: 'solid', style: 'minimal', season: 'all-season', imageUrl: '/outfit-placeholders/black-pants.jpg' },
            { id: 403, type: 'outerwear', category: 'coat', color: 'gray', pattern: 'solid', style: 'minimal', season: 'winter', imageUrl: '/outfit-placeholders/gray-coat.jpg' },
            { id: 404, type: 'footwear', category: 'boots', color: 'black', pattern: 'solid', style: 'minimal', season: 'winter', imageUrl: '/outfit-placeholders/black-boots.jpg' },
        ]
    },
    {
        id: 5,
        name: 'Festival Outfit',
        occasion: 'festival',
        season: 'summer',
        style: 'bohemian',
        items: [
            { id: 501, type: 'top', category: 'crop-top', color: 'red', pattern: 'floral', style: 'bohemian', season: 'summer', imageUrl: '/outfit-placeholders/red-top.jpg' },
            { id: 502, type: 'bottom', category: 'shorts', color: 'blue', pattern: 'solid', style: 'bohemian', season: 'summer', imageUrl: '/outfit-placeholders/blue-shorts.jpg' },
            { id: 503, type: 'footwear', category: 'boots', color: 'brown', pattern: 'solid', style: 'bohemian', season: 'all-season', imageUrl: '/outfit-placeholders/brown-boots.jpg' },
        ]
    },
    {
        id: 6,
        name: 'Office Smart',
        occasion: 'work',
        season: 'all-season',
        style: 'business',
        items: [
            { id: 601, type: 'top', category: 'blouse', color: 'blue', pattern: 'solid', style: 'business', season: 'all-season', imageUrl: '/outfit-placeholders/blue-blouse.jpg' },
            { id: 602, type: 'bottom', category: 'skirt', color: 'black', pattern: 'solid', style: 'business', season: 'all-season', imageUrl: '/outfit-placeholders/black-skirt.jpg' },
            { id: 603, type: 'footwear', category: 'heels', color: 'black', pattern: 'solid', style: 'business', season: 'all-season', imageUrl: '/outfit-placeholders/black-heels.jpg' },
        ]
    }
];

// Personalized recommendation algorithm
async function getRecommendations(userId: string, filters: any = {}) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Get user from database (or return default if not found)
    const user = users[userId] || users['user123'];

    // Calculate matching scores for each outfit based on user preferences
    const scoredOutfits = outfits.map(outfit => {
        let score = 0;

        // Score based on style match
        if (user.stylePreferences.styles.includes(outfit.style)) {
            score += 30;
        }

        // Score based on occasion match (if filter provided)
        if (filters.occasion && outfit.occasion === filters.occasion) {
            score += 20;
        } else if (user.stylePreferences.occasions.includes(outfit.occasion)) {
            score += 15;
        }

        // Score based on season match (if filter provided)
        if (filters.season && outfit.season === filters.season) {
            score += 20;
        } else if (outfit.season === 'all-season' || user.stylePreferences.seasons.includes(outfit.season)) {
            score += 15;
        }

        // Score color preferences
        const colorMatches = outfit.items.filter(item =>
            user.stylePreferences.colors.includes(item.color)
        ).length;

        // Add 5 points per color match
        score += colorMatches * 5;

        // Score pattern preferences
        const patternMatches = outfit.items.filter(item =>
            user.stylePreferences.patterns.includes(item.pattern)
        ).length;

        // Add 5 points per pattern match
        score += patternMatches * 5;

        // Add slight randomization (±5 points)
        score += Math.floor(Math.random() * 10) - 5;

        // Cap at 100, minimum of 0
        score = Math.max(0, Math.min(100, score));

        return {
            ...outfit,
            score
        };
    });

    // Sort by score (highest first)
    const sortedOutfits = scoredOutfits.sort((a, b) => b.score - a.score);

    // Return top recommendations
    return sortedOutfits;
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validate input - require a user ID for personalization
        if (!data.userId) {
            return NextResponse.json(
                { error: 'User ID is required for personalized recommendations' },
                { status: 400 }
            );
        }

        // Optional filters (occasion, season, etc.)
        const filters = {
            occasion: data.occasion || null,
            season: data.season || null,
            style: data.style || null
        };

        // Get personalized recommendations
        const recommendations = await getRecommendations(data.userId, filters);

        return NextResponse.json({
            success: true,
            data: {
                recommendations: recommendations.slice(0, 4) // Return top 4 outfits
            }
        });

    } catch (error) {
        console.error('Error generating personalized recommendations:', error);
        return NextResponse.json(
            { error: 'Failed to generate recommendations' },
            { status: 500 }
        );
    }
} 