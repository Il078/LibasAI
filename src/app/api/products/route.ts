// Simple products API
// Mock product database with real images
const products = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        category: "t-shirt",
        color: "white",
        pattern: "solid",
        material: "cotton",
        style: "casual",
        season: "all-season",
        price: 29.99,
        currency: "USD",
        storeId: 1,
        storeName: "Zara",
        storeLogoUrl: "/store-logos/zara.png",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=300",
        productUrl: "https://example.com/zara/white-tshirt",
        match_score: 95
    },
    {
        id: 2,
        name: "Blue Slim Fit Jeans",
        category: "jeans",
        color: "blue",
        pattern: "solid",
        material: "denim",
        style: "casual",
        season: "all-season",
        price: 59.99,
        currency: "USD",
        storeId: 1,
        storeName: "Zara",
        storeLogoUrl: "/store-logos/zara.png",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=300",
        productUrl: "https://example.com/zara/blue-jeans",
        match_score: 88
    },
    {
        id: 3,
        name: "Black Formal Dress",
        category: "dress",
        color: "black",
        pattern: "solid",
        material: "polyester",
        style: "formal",
        season: "all-season",
        price: 129.99,
        currency: "USD",
        storeId: 2,
        storeName: "H&M",
        storeLogoUrl: "/store-logos/h&m.png",
        imageUrl: "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=300",
        productUrl: "https://example.com/h&m/black-dress",
        match_score: 92
    },
    {
        id: 4,
        name: "Gray Wool Sweater",
        category: "sweater",
        color: "gray",
        pattern: "solid",
        material: "wool",
        style: "casual",
        season: "winter",
        price: 79.99,
        currency: "USD",
        storeId: 3,
        storeName: "Uniqlo",
        storeLogoUrl: "/store-logos/uniqlo.png",
        imageUrl: "https://images.unsplash.com/photo-1580331451062-99ff652288d7?q=80&w=300",
        productUrl: "https://example.com/uniqlo/gray-sweater",
        match_score: 87
    },
    {
        id: 5,
        name: "Black Leather Jacket",
        category: "jacket",
        color: "black",
        pattern: "solid",
        material: "leather",
        style: "casual",
        season: "fall",
        price: 199.99,
        currency: "USD",
        storeId: 4,
        storeName: "Mango",
        storeLogoUrl: "/store-logos/mango.png",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=300",
        productUrl: "https://example.com/mango/leather-jacket",
        match_score: 91
    },
    {
        id: 6,
        name: "Floral Summer Dress",
        category: "dress",
        color: "blue",
        pattern: "floral",
        material: "cotton",
        style: "casual",
        season: "summer",
        price: 69.99,
        currency: "USD",
        storeId: 4,
        storeName: "Mango",
        storeLogoUrl: "/store-logos/mango.png",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=300",
        productUrl: "https://example.com/mango/floral-dress",
        match_score: 85
    }
];

// API handlers
export async function GET() {
    console.log("GET /api/products was called");
    return Response.json({
        success: true,
        data: {
            products
        }
    });
}

export async function POST(request: Request) {
    try {
        console.log("POST /api/products was called");

        let data;
        try {
            data = await request.json();
            console.log("Request data:", data);
        } catch (error) {
            console.error("Error parsing request JSON:", error);
            data = {};
        }

        // For testing, just return all products with match scores
        console.log(`Returning ${products.length} products`);

        return Response.json({
            success: true,
            data: {
                recommendations: products,
                totalResults: products.length
            }
        });

    } catch (error) {
        console.error('Error finding products:', error);
        return Response.json(
            { error: 'Failed to get products', message: String(error) },
            { status: 500 }
        );
    }
} 