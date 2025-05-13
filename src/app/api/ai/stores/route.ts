// Store Recommendation API

// Store interface
interface Store {
    id: number;
    name: string;
    description: string;
    logoUrl: string;
    storeUrl: string;
    categories: string[];
    styles: string[];
    priceRange: string;
}

// Mock store data
const stores: Store[] = [
    {
        id: 1,
        name: "Zara",
        description: "Modern, trendy clothing with European style influence. Known for fast fashion that adapts runway trends quickly.",
        logoUrl: "/store-logos/zara.png",
        storeUrl: "https://www.zara.com",
        categories: ["tops", "bottoms", "dresses", "outerwear", "accessories"],
        styles: ["modern", "trendy", "minimalist", "casual", "business"],
        priceRange: "mid-range"
    },
    {
        id: 2,
        name: "H&M",
        description: "Affordable fashion for the whole family with sustainability initiatives. Offers basics and trendy pieces alike.",
        logoUrl: "/store-logos/h&m.png",
        storeUrl: "https://www.hm.com",
        categories: ["tops", "bottoms", "dresses", "outerwear", "underwear", "activewear"],
        styles: ["casual", "basics", "trendy", "business", "sustainable"],
        priceRange: "budget"
    },
    {
        id: 3,
        name: "Uniqlo",
        description: "Japanese brand known for high-quality basics, innovative fabrics, and minimalist designs that are built to last.",
        logoUrl: "/store-logos/uniqlo.png",
        storeUrl: "https://www.uniqlo.com",
        categories: ["tops", "bottoms", "outerwear", "innerwear", "loungewear"],
        styles: ["minimalist", "basic", "practical", "casual", "athleisure"],
        priceRange: "mid-range"
    },
    {
        id: 4,
        name: "Mango",
        description: "Mediterranean-inspired fashion with elegant and contemporary designs for the modern woman.",
        logoUrl: "/store-logos/mango.png",
        storeUrl: "https://shop.mango.com",
        categories: ["tops", "bottoms", "dresses", "outerwear", "accessories"],
        styles: ["elegant", "contemporary", "feminine", "business", "casual"],
        priceRange: "mid-range"
    }
];

// Simple store recommendation function
function getStoreRecommendations(params: any = {}) {
    console.log("Store recommendation params:", params);

    // Add match scores to stores
    return stores.map(store => ({
        ...store,
        score: Math.floor(70 + Math.random() * 30) // Random score between 70-100
    }));
}

// API handlers
export async function GET() {
    console.log("GET /api/ai/stores was called");
    return Response.json({
        success: true,
        data: {
            stores
        }
    });
}

export async function POST(request: Request) {
    try {
        console.log("POST /api/ai/stores was called");

        let data;
        try {
            data = await request.json();
            console.log("Request data:", data);
        } catch (error) {
            console.error("Error parsing request JSON:", error);
            data = {};
        }

        // Get store recommendations (simplified)
        const recommendations = getStoreRecommendations(data);

        console.log(`Found ${recommendations.length} store recommendations`);

        return Response.json({
            success: true,
            data: {
                recommendations: recommendations.slice(0, 4), // Return top 4 stores
                totalResults: recommendations.length
            }
        });

    } catch (error) {
        console.error('Error finding store recommendations:', error);
        return Response.json(
            { error: 'Failed to get store recommendations', message: String(error) },
            { status: 500 }
        );
    }
} 