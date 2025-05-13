'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getPersonalizedRecommendations } from '@/lib/ai-service';

// Define recommendation types
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
    score: number;
}

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('outfits');
    const [recommendations, setRecommendations] = useState<Outfit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load recommendations when the recommendations tab is selected
    useEffect(() => {
        if (activeTab === 'recommendations') {
            loadRecommendations();
        }
    }, [activeTab]);

    // Load personalized recommendations
    const loadRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Use demo user ID for now
            const response = await getPersonalizedRecommendations('user123', {
                season: getCurrentSeason()
            });

            if (response.success) {
                setRecommendations(response.data.recommendations);
            } else {
                throw new Error(response.error || 'Failed to fetch recommendations');
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setError('Unable to fetch personalized recommendations. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get current season
    const getCurrentSeason = () => {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'fall';
        return 'winter';
    };

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

    return (
        <motion.main
            className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-[#4040a1]">Dashboard</h1>
                <p className="mt-2 text-lg text-gray-600">Welcome to your LibasAI dashboard</p>
            </div>

            {/* Dashboard Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('outfits')}
                        className={`${activeTab === 'outfits'
                            ? 'border-b-2 border-[#4040a1] text-[#4040a1]'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap pb-4 px-1 font-medium text-sm transition-colors duration-200`}
                    >
                        Recent Outfits
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`${activeTab === 'favorites'
                            ? 'border-b-2 border-[#4040a1] text-[#4040a1]'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap pb-4 px-1 font-medium text-sm transition-colors duration-200`}
                    >
                        Favorites
                    </button>
                    <button
                        onClick={() => setActiveTab('recommendations')}
                        className={`${activeTab === 'recommendations'
                            ? 'border-b-2 border-[#4040a1] text-[#4040a1]'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap pb-4 px-1 font-medium text-sm transition-colors duration-200`}
                    >
                        AI Recommendations
                    </button>
                </nav>
            </div>

            {/* Dashboard Content */}
            <div className="mt-8">
                {activeTab === 'outfits' && (
                    <motion.div
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.div
                            className="flex flex-col overflow-hidden rounded-lg shadow-sm border border-gray-100"
                            variants={item}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="relative flex-shrink-0 h-48 bg-gray-50">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500">Outfit image</p>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col justify-between bg-white p-6">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Casual Friday</p>
                                    <p className="mt-3 text-sm text-gray-500">Created on May 1, 2023</p>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <div className="flex-shrink-0">
                                        <button className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors">Edit</button>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <button className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex flex-col overflow-hidden rounded-lg shadow-sm border border-gray-100"
                            variants={item}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="relative flex-shrink-0 h-48 bg-gray-50">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500">Outfit image</p>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col justify-between bg-white p-6">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Weekend Brunch</p>
                                    <p className="mt-3 text-sm text-gray-500">Created on May 3, 2023</p>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <div className="flex-shrink-0">
                                        <button className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors">Edit</button>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <button className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {activeTab === 'favorites' && (
                    <motion.div
                        className="text-center py-12 bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new outfit.</p>
                        <motion.div
                            className="mt-6"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/outfit"
                                className="inline-flex items-center rounded-md border border-transparent bg-[#4040a1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#333380] transition-colors"
                            >
                                Create Outfit
                            </Link>
                        </motion.div>
                    </motion.div>
                )}

                {activeTab === 'recommendations' && (
                    <div>
                        {isLoading ? (
                            <motion.div
                                className="text-center py-12 bg-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
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
                                <h3 className="mt-4 text-sm font-medium text-gray-900">Loading AI recommendations</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Our AI is personalizing outfit suggestions for you...
                                </p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                className="text-center py-12 bg-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading recommendations</h3>
                                <p className="mt-1 text-sm text-gray-500">{error}</p>
                                <motion.div
                                    className="mt-6"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <button
                                        onClick={loadRecommendations}
                                        className="inline-flex items-center rounded-md border border-transparent bg-[#4040a1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#333380] transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </motion.div>
                            </motion.div>
                        ) : recommendations.length === 0 ? (
                            <motion.div
                                className="text-center py-12 bg-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations yet</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Add more items to your closet to get personalized outfit recommendations.
                                </p>
                                <motion.div
                                    className="mt-6"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/closet"
                                        className="inline-flex items-center rounded-md border border-transparent bg-[#4040a1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#333380] transition-colors"
                                    >
                                        Add to Closet
                                    </Link>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="space-y-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-base text-gray-600">
                                    Personalized outfit recommendations based on your style preferences and the current season.
                                </p>

                                <motion.div
                                    className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2"
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {recommendations.map((outfit) => (
                                        <motion.div
                                            key={outfit.id}
                                            className="overflow-hidden rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                            variants={item}
                                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                        >
                                            <div className="p-5">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">{outfit.name}</h3>
                                                        <div className="mt-1 flex space-x-2">
                                                            <span className="inline-flex items-center rounded-full bg-[#4040a1]/10 px-2.5 py-0.5 text-xs font-medium text-[#4040a1] capitalize">
                                                                {outfit.occasion}
                                                            </span>
                                                            <span className="inline-flex items-center rounded-full bg-[#4040a1]/10 px-2.5 py-0.5 text-xs font-medium text-[#4040a1] capitalize">
                                                                {outfit.season}
                                                            </span>
                                                            <span className="inline-flex items-center rounded-full bg-[#4040a1]/10 px-2.5 py-0.5 text-xs font-medium text-[#4040a1] capitalize">
                                                                {outfit.style}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center h-10 w-10 bg-[#4040a1]/5 rounded-full">
                                                        <span className="text-sm font-bold text-[#4040a1]">{outfit.score}%</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex overflow-x-auto pb-2 space-x-3">
                                                    {outfit.items.map((item) => (
                                                        <div key={item.id} className="flex-shrink-0 w-20">
                                                            <div className="overflow-hidden rounded bg-gray-100 aspect-square relative">
                                                                <div className="absolute inset-0 flex items-center justify-center text-xs text-center text-gray-500 capitalize p-1">
                                                                    {item.color} {item.category}
                                                                </div>
                                                            </div>
                                                            <p className="mt-1 text-xs text-center text-gray-500 truncate">{item.type}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-4 flex justify-end space-x-3">
                                                    <motion.button
                                                        className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Add to Favorites
                                                    </motion.button>
                                                    <motion.button
                                                        className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        See Details
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <div className="flex justify-center mt-6">
                                    <motion.button
                                        onClick={loadRecommendations}
                                        className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors flex items-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        Refresh Recommendations
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-12">
                <h2 className="text-lg font-medium text-[#4040a1] mb-2">Quick Actions</h2>
                <motion.div
                    className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div
                        className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                        variants={item}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-[#4040a1]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-900">Create New Outfit</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Design a new outfit combination from your closet
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                href="/outfit"
                                className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors"
                            >
                                Get Started →
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                        variants={item}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-[#4040a1]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-900">Manage Closet</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Add, organize, and categorize your clothing items
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                href="/closet"
                                className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors"
                            >
                                View Closet →
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                        variants={item}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-[#4040a1]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-900">AI Styling</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get AI-powered outfit recommendations for any occasion
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                href="/outfit?ai=true"
                                className="text-sm font-medium text-[#4040a1] hover:text-[#333380] transition-colors"
                            >
                                Try AI Styling →
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.main>
    );
} 