'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { classifyClothingItem, getOutfitMatches, getStoreRecommendations, getProductRecommendations, getImageEmbeddings } from '@/lib/ai-service';

// Type definitions
interface ClassifiedItem {
    category: string;
    attributes: {
        color: string;
        pattern: string;
        material: string;
        style: string;
        season: string;
    };
    confidence: string;
}

interface MatchedItem {
    id: number;
    category: string;
    color: string;
    pattern: string;
    material: string;
    style: string;
    season: string;
    match_score: number;
}

interface StoreRecommendation {
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

interface ProductItem {
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
    imageUrl: string;
    productUrl: string;
    match_score: number;
}

export default function CreateOutfit() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [classifiedItem, setClassifiedItem] = useState<ClassifiedItem | null>(null);
    const [matchedItems, setMatchedItems] = useState<MatchedItem[] | null>(null);
    const [productItems, setProductItems] = useState<ProductItem[] | null>(null);
    const [storeRecommendations, setStoreRecommendations] = useState<StoreRecommendation[] | null>(null);
    const [selectedItems, setSelectedItems] = useState<ProductItem[]>([]);
    const [occasion, setOccasion] = useState('casual');
    const [aiMode, setAiMode] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Handle file upload and convert to base64
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result as string);
                // Reset any previous results
                setClassifiedItem(null);
                setMatchedItems(null);
                setStoreRecommendations(null);
                setProductItems(null);
                setSelectedItems([]);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    // Add item to outfit
    const addToOutfit = (product: ProductItem) => {
        // Check if the item is already in the outfit
        if (!selectedItems.some(item => item.id === product.id)) {
            setSelectedItems([...selectedItems, product]);
        }
    };

    // Remove item from outfit
    const removeFromOutfit = (productId: number) => {
        setSelectedItems(selectedItems.filter(item => item.id !== productId));
    };

    // Generate outfit matches using AI
    const generateMatches = async () => {
        if (!uploadedImage) return;

        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Classify the uploaded image
            const classificationResponse = await classifyClothingItem(uploadedImage);

            if (!classificationResponse.success) {
                throw new Error(classificationResponse.error || 'Failed to classify image');
            }

            const classifiedData = classificationResponse.data;
            setClassifiedItem(classifiedData);

            // Step 2: Generate image embeddings for visual similarity (CLIP model)
            let embeddings = null;
            try {
                console.log("Getting visual embeddings for outfit matching");
                const embeddingResponse = await getImageEmbeddings(uploadedImage);
                if (embeddingResponse.success) {
                    embeddings = embeddingResponse.data;
                    console.log("Successfully generated embeddings with source:", embeddings?.source || 'unknown');
                }
            } catch (embedError) {
                console.error("Error generating embeddings, will continue without them:", embedError);
            }

            // Step 3: Get outfit matches based on classified item
            const matchResponse = await getOutfitMatches(classifiedData, occasion);

            if (!matchResponse.success) {
                throw new Error(matchResponse.error || 'Failed to get matches');
            }

            setMatchedItems(matchResponse.data.matches);

            // Step 4: Get store recommendations based on classified item
            try {
                const storeResponse = await getStoreRecommendations({
                    category: classifiedData.category,
                    style: classifiedData.attributes.style,
                    priceRange: occasion === 'formal' ? 'premium' : 'mid-range'
                });

                if (storeResponse.success) {
                    console.log("Successfully received store recommendations:", storeResponse.data.recommendations?.length || 0);
                    setStoreRecommendations(storeResponse.data.recommendations);
                } else {
                    console.error("Store API returned unsuccessful response:", storeResponse);
                }
            } catch (storeError) {
                console.error("Error getting store recommendations:", storeError);
            }

            // Step 5: Get product recommendations with images and visual similarity
            try {
                const productResponse = await getProductRecommendations({
                    category: classifiedData.category,
                    color: classifiedData.attributes.color,
                    style: classifiedData.attributes.style,
                    pattern: classifiedData.attributes.pattern,
                    season: classifiedData.attributes.season,
                    imageData: uploadedImage // Pass image data for visual similarity
                });

                if (productResponse.success) {
                    console.log("Successfully received product recommendations:", productResponse.data.recommendations?.length || 0);
                    setProductItems(productResponse.data.recommendations);
                    // Add the base item (uploaded) as the first in selectedItems
                    if (productResponse.data.recommendations?.length > 0) {
                        setSelectedItems([{
                            ...productResponse.data.recommendations[0],
                            id: 0, // Use a unique ID for the uploaded item
                            name: `${classifiedData.attributes.color} ${classifiedData.category}`,
                            imageUrl: uploadedImage
                        }]);
                    }
                } else {
                    console.error("Product API returned unsuccessful response:", productResponse);
                    setError("Failed to get product recommendations. Please try again.");
                }
            } catch (productError) {
                console.error("Error getting product recommendations:", productError);
                setError("Failed to connect to product API. Please try again.");
            }

        } catch (err) {
            console.error('Error in AI processing:', err);
            setError('Failed to process your request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Render attribute badge with color coding by confidence
    const renderAttributeBadge = (label: string, value: string, confidence: number) => {
        let bgColor = 'bg-gray-100';

        // Color code based on confidence
        if (confidence > 0.8) {
            bgColor = 'bg-green-100';
        } else if (confidence > 0.6) {
            bgColor = 'bg-yellow-100';
        } else {
            bgColor = 'bg-red-100';
        }

        return (
            <div className={`${bgColor} px-3 py-1 rounded-full text-xs font-medium`}>
                <span className="font-semibold">{label}:</span> {value}
            </div>
        );
    };

    return (
        <motion.main
            className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-[#4040a1]">Create Outfit</h1>
                <p className="mt-2 text-lg text-gray-600">
                    Upload an item and get AI-powered outfit suggestions
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left column - Upload and settings */}
                <motion.div
                    className="space-y-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                        variants={item}
                    >
                        <h2 className="text-lg font-medium text-[#4040a1] mb-4">Start with an Item</h2>

                        <div className="flex items-center mb-4">
                            <div className="flex items-center">
                                <input
                                    id="default-mode"
                                    name="mode"
                                    type="radio"
                                    checked={!aiMode}
                                    onChange={() => setAiMode(false)}
                                    className="h-4 w-4 border-gray-300 text-[#4040a1] focus:ring-[#4040a1]"
                                />
                                <label htmlFor="default-mode" className="ml-2 block text-sm font-medium text-gray-700">
                                    Match from My Closet
                                </label>
                            </div>

                            <div className="flex items-center ml-6">
                                <input
                                    id="ai-mode"
                                    name="mode"
                                    type="radio"
                                    checked={aiMode}
                                    onChange={() => setAiMode(true)}
                                    className="h-4 w-4 border-gray-300 text-[#4040a1] focus:ring-[#4040a1]"
                                />
                                <label htmlFor="ai-mode" className="ml-2 block text-sm font-medium text-gray-700">
                                    AI Styling
                                </label>
                            </div>
                        </div>

                        {!uploadedImage ? (
                            <motion.div
                                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 bg-gray-50"
                                whileHover={{ borderColor: '#4040a1', transition: { duration: 0.3 } }}
                            >
                                <div className="text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-[#4040a1] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#4040a1] focus-within:ring-offset-2 hover:text-[#333380] transition-colors"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="mt-2 relative"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-full aspect-square relative rounded-lg overflow-hidden border border-gray-100">
                                    <Image
                                        src={uploadedImage}
                                        alt="Uploaded clothing item"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-lg"
                                    />
                                </div>
                                <motion.button
                                    type="button"
                                    onClick={() => setUploadedImage(null)}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4040a1] shadow-sm"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <span className="sr-only">Remove image</span>
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Show classification results if available */}
                        {classifiedItem && (
                            <motion.div
                                className="mt-6 bg-[#4040a1]/5 p-4 rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-sm font-medium text-gray-900 mb-2">AI Classification Results</h3>
                                <div className="flex flex-wrap gap-2">
                                    <div className="bg-[#4040a1]/10 px-3 py-1 rounded-full text-xs font-bold text-[#4040a1]">
                                        {classifiedItem.category.toUpperCase()}
                                    </div>
                                    {Object.entries(classifiedItem.attributes).map(([key, value]) => (
                                        <div key={key} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                                            <span className="capitalize">{key}</span>: {value}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    Confidence: {classifiedItem.confidence}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Outfit settings */}
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                        variants={item}
                    >
                        <h2 className="text-lg font-medium text-[#4040a1] mb-4">Outfit Settings</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="occasion" className="block text-sm font-medium text-gray-700">
                                    Occasion
                                </label>
                                <select
                                    id="occasion"
                                    name="occasion"
                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#4040a1] focus:outline-none focus:ring-[#4040a1] sm:text-sm"
                                    value={occasion}
                                    onChange={(e) => setOccasion(e.target.value)}
                                >
                                    <option value="casual">Casual</option>
                                    <option value="formal">Formal</option>
                                    <option value="business">Business</option>
                                    <option value="date-night">Date Night</option>
                                    <option value="workout">Workout</option>
                                    <option value="vacation">Vacation</option>
                                </select>
                            </div>

                            {aiMode && (
                                <div>
                                    <label htmlFor="style-preferences" className="block text-sm font-medium text-gray-700">
                                        Style Preferences
                                    </label>
                                    <input
                                        type="text"
                                        name="style-preferences"
                                        id="style-preferences"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4040a1] focus:ring-[#4040a1] sm:text-sm"
                                        placeholder="e.g., minimalist, vintage, streetwear"
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="weather" className="block text-sm font-medium text-gray-700">
                                    Weather Conditions
                                </label>
                                <select
                                    id="weather"
                                    name="weather"
                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#4040a1] focus:outline-none focus:ring-[#4040a1] sm:text-sm"
                                >
                                    <option value="sunny">Sunny</option>
                                    <option value="rainy">Rainy</option>
                                    <option value="cold">Cold</option>
                                    <option value="hot">Hot</option>
                                    <option value="snowy">Snowy</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    <motion.button
                        type="button"
                        className={`w-full py-3 px-4 rounded-md shadow-sm text-white font-medium transition-colors ${!uploadedImage
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#4040a1] hover:bg-[#333380] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4040a1]'
                            }`}
                        disabled={!uploadedImage || isLoading}
                        onClick={generateMatches}
                        variants={item}
                        whileHover={!uploadedImage || isLoading ? {} : { scale: 1.02 }}
                        whileTap={!uploadedImage || isLoading ? {} : { scale: 0.98 }}
                    >
                        {isLoading ? 'Processing with AI...' : 'Generate Outfit Matches'}
                    </motion.button>

                    {error && (
                        <motion.div
                            className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Current Outfit Display */}
                    {selectedItems.length > 0 && (
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2 className="text-lg font-medium text-[#4040a1] mb-4">Your Outfit</h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {selectedItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        className="relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50"
                                        whileHover={{ y: -5, scale: 1.02 }}
                                    >
                                        <div className="aspect-square relative">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <button
                                                onClick={() => removeFromOutfit(item.id)}
                                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm text-gray-500 hover:text-red-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="p-2">
                                            <p className="text-xs font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-between">
                                <motion.button
                                    type="button"
                                    className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Save Outfit
                                </motion.button>
                                <motion.button
                                    type="button"
                                    className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Share
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Right column - Results */}
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Product Recommendations Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-medium text-[#4040a1] mb-4">AI Product Recommendations</h2>

                        {!productItems && !isLoading && (
                            <div className="text-center py-16">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No product matches yet</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Upload an item and click "Generate Outfit Matches" to see AI-powered product suggestions.
                                </p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="text-center py-16">
                                <motion.svg
                                    className="h-10 w-10 mx-auto text-[#4040a1]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </motion.svg>
                                <h3 className="mt-4 text-sm font-medium text-gray-900">AI is analyzing your item</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Finding the perfect matches based on style, color, and occasion...
                                </p>
                            </div>
                        )}

                        {productItems && !isLoading && (
                            <motion.div
                                className="space-y-6"
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                <p className="text-sm text-gray-500">
                                    Based on your {classifiedItem?.category} and {occasion} occasion, we've found these matches:
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    {productItems.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                            variants={item}
                                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                        >
                                            <div className="aspect-square relative">
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                                <div className="absolute top-2 right-2 bg-[#4040a1] text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {product.match_score}%
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                                                <div className="flex justify-between items-center mt-1">
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-xs bg-[#4040a1]/10 text-[#4040a1] px-1.5 py-0.5 rounded-sm capitalize">
                                                            {product.material}
                                                        </span>
                                                        <span className="text-xs bg-[#4040a1]/10 text-[#4040a1] px-1.5 py-0.5 rounded-sm capitalize">
                                                            {product.color}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-medium">${product.price}</span>
                                                </div>
                                                <div className="mt-3 flex justify-between items-center">
                                                    <button
                                                        className="text-xs font-medium text-[#4040a1] hover:text-[#333380] transition-colors"
                                                        onClick={() => window.open(product.productUrl, "_blank")}
                                                    >
                                                        View Product
                                                    </button>
                                                    <motion.button
                                                        className="text-xs font-medium bg-[#4040a1] text-white px-2 py-1 rounded hover:bg-[#333380] transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => addToOutfit(product)}
                                                        disabled={selectedItems.some(item => item.id === product.id)}
                                                    >
                                                        {selectedItems.some(item => item.id === product.id)
                                                            ? 'Added to Outfit'
                                                            : 'Add to Outfit'}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Store Recommendations Section */}
                    {storeRecommendations && !isLoading && (
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h2 className="text-lg font-medium text-[#4040a1] mb-4">Where to Shop</h2>

                            <p className="text-sm text-gray-500 mb-4">
                                Based on your style and preferences, here are some stores we recommend:
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {storeRecommendations.map((store) => (
                                    <motion.div
                                        key={store.id}
                                        className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    >
                                        <div className="flex items-center mb-2">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                                <div className="relative w-10 h-10">
                                                    {/* Use a placeholder for now */}
                                                    <div className="absolute inset-0 bg-[#4040a1]/20 flex items-center justify-center text-[#4040a1] font-bold text-sm">
                                                        {store.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-sm">{store.name}</h3>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-xs bg-[#4040a1]/10 text-[#4040a1] px-2 py-0.5 rounded-full">
                                                        {store.score}% match
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                            {store.description}
                                        </p>

                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs font-light">
                                                Price: {store.priceRange === 'budget' ? '💰' :
                                                    store.priceRange === 'mid-range' ? '💰💰' :
                                                        store.priceRange === 'premium' ? '💰💰💰' : '💰💰💰💰'}
                                            </span>
                                            <motion.a
                                                href={store.storeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-medium text-[#4040a1] hover:text-[#333380]"
                                                whileHover={{ x: 2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Visit Store →
                                            </motion.a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.main>
    );
} 