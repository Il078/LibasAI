import { NextResponse } from 'next/server';

// Mock product database with real images and store information
interface Product {
    id: number;
    name: string;
    category: string;
    color: string;
    pattern: string;
    material: string;
    style: string;
    season: string;
    price: number;
    currency: string;
    storeId: number;
    storeName: string;
    storeLogoUrl: string;
    imageUrl: string;
    productUrl: string;
    match_score?: number;
}

// Popular clothing stores
const stores = [
    { id: 1, name: "Zara", logo: "/store-logos/zara.png" },
    { id: 2, name: "H&M", logo: "/store-logos/h&m.png" },
    { id: 3, name: "Uniqlo", logo: "/store-logos/uniqlo.png" },
    { id: 4, name: "Mango", logo: "/store-logos/mango.png" },
    { id: 5, name: "ASOS", logo: "/store-logos/asos.png" },
    { id: 6, name: "Nike", logo: "/store-logos/nike.png" },
    { id: 7, name: "Adidas", logo: "/store-logos/adidas.png" },
    { id: 8, name: "Levi's", logo: "/store-logos/levis.png" }
];

const products: Product[] = [
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
        productUrl: "https://example.com/zara/white-tshirt"
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
        productUrl: "https://example.com/zara/blue-jeans"
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
        productUrl: "https://example.com/h&m/black-dress"
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
        productUrl: "https://example.com/uniqlo/gray-sweater"
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
        productUrl: "https://example.com/mango/leather-jacket"
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
        productUrl: "https://example.com/mango/floral-dress"
    }
];

// Simple product recommendation function
function getProductRecommendations(params: any = {}) {
    console.log("Product recommendation params:", params);

    // Add match scores to products
    return products.map(product => ({
        ...product,
        match_score: Math.floor(60 + Math.random() * 40) // Random score between 60-100
    }));
}

// API handlers
export async function GET() {
    console.log("GET /api/ai/products was called");
    return Response.json({
        success: true,
        data: {
            products,
            stores
        }
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category, color, style, pattern, season } = body;

        // Mock data for demonstration
        const mockProducts = [
            {
                id: '1',
                name: 'Classic White T-Shirt',
                price: 29.99,
                category: category || 't-shirt',
                color: color || 'white',
                style: style || 'casual',
                pattern: pattern || 'solid',
                material: 'cotton',
                imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
                productUrl: 'https://example.com/product/1',
                storeName: 'Fashion Store',
                match_score: 95
            },
            {
                id: '2',
                name: 'Slim Fit Jeans',
                price: 79.99,
                category: 'jeans',
                color: 'blue',
                style: 'casual',
                pattern: 'solid',
                material: 'denim',
                imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
                productUrl: 'https://example.com/product/2',
                storeName: 'Denim Co.',
                match_score: 85
            },
            {
                id: '3',
                name: 'Leather Jacket',
                price: 199.99,
                category: 'jacket',
                color: 'black',
                style: 'casual',
                pattern: 'solid',
                material: 'leather',
                imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
                productUrl: 'https://example.com/product/3',
                storeName: 'Leather Goods',
                match_score: 75
            }
        ];

        // Filter products based on provided criteria
        const filteredProducts = mockProducts.filter(product => {
            if (category && product.category !== category) return false;
            if (color && product.color !== color) return false;
            if (style && product.style !== style) return false;
            if (pattern && product.pattern !== pattern) return false;
            return true;
        });

        return NextResponse.json({
            success: true,
            data: {
                recommendations: filteredProducts
            }
        });
    } catch (error) {
        console.error('Error in product recommendations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get product recommendations' },
            { status: 500 }
        );
    }
} 