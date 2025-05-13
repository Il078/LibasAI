// Simple stores API
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
    score: number;
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
        priceRange: "mid-range",
        score: 92
    },
    {
        id: 2,
        name: "H&M",
        description: "Affordable fashion for the whole family with sustainability initiatives. Offers basics and trendy pieces alike.",
        logoUrl: "/store-logos/h&m.png",
        storeUrl: "https://www.hm.com",
        categories: ["tops", "bottoms", "dresses", "outerwear", "underwear", "activewear"],
        styles: ["casual", "basics", "trendy", "business", "sustainable"],
        priceRange: "budget",
        score: 89
    },
    {
        id: 3,
        name: "Uniqlo",
        description: "Japanese brand known for high-quality basics, innovative fabrics, and minimalist designs that are built to last.",
        logoUrl: "/store-logos/uniqlo.png",
        storeUrl: "https://www.uniqlo.com",
        categories: ["tops", "bottoms", "outerwear", "innerwear", "loungewear"],
        styles: ["minimalist", "basic", "practical", "casual", "athleisure"],
        priceRange: "mid-range",
        score: 94
    },
    {
        id: 4,
        name: "Mango",
        description: "Mediterranean-inspired fashion with elegant and contemporary designs for the modern woman.",
        logoUrl: "/store-logos/mango.png",
        storeUrl: "https://shop.mango.com",
        categories: ["tops", "bottoms", "dresses", "outerwear", "accessories"],
        styles: ["elegant", "contemporary", "feminine", "business", "casual"],
        priceRange: "mid-range",
        score: 86
    }
];

// API handlers
export async function GET() {
    console.log("GET /api/stores was called");
    return Response.json({
        success: true,
        data: {
            stores
        }
    });
}

export async function POST(request: Request) {
    try {
        console.log("POST /api/stores was called");

        let data;
        try {
            data = await request.json();
            console.log("Request data:", data);
        } catch (error) {
            console.error("Error parsing request JSON:", error);
            data = {};
        }

        // For testing, just return all stores with scores
        console.log(`Returning ${stores.length} stores`);

        return Response.json({
            success: true,
            data: {
                recommendations: stores,
                totalResults: stores.length
            }
        });

    } catch (error) {
        console.error('Error finding stores:', error);
        return Response.json(
            { error: 'Failed to get stores', message: String(error) },
            { status: 500 }
        );
    }
} 