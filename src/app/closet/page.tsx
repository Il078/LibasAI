'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

type ClothingCategory = 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'accessories' | 'all';

export default function Closet() {
    const [activeCategory, setActiveCategory] = useState<ClothingCategory>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock clothing items data
    const clothingItems = [
        { id: 1, name: 'White T-Shirt', category: 'tops', color: 'white', occasion: 'casual' },
        { id: 2, name: 'Blue Jeans', category: 'bottoms', color: 'blue', occasion: 'casual' },
        { id: 3, name: 'Black Leather Jacket', category: 'outerwear', color: 'black', occasion: 'casual' },
        { id: 4, name: 'Brown Boots', category: 'shoes', color: 'brown', occasion: 'casual' },
        { id: 5, name: 'Silver Watch', category: 'accessories', color: 'silver', occasion: 'formal' },
        { id: 6, name: 'Navy Blazer', category: 'outerwear', color: 'navy', occasion: 'formal' },
    ];

    // Filter items by category and search query
    const filteredItems = clothingItems.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.occasion.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <motion.main
            className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#4040a1]">My Closet</h1>
                    <p className="mt-2 text-lg text-gray-600">Manage your wardrobe</p>
                </div>
                <Link
                    href="/closet/add"
                    className="inline-flex items-center justify-center rounded-md bg-[#4040a1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#333380] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4040a1] transition-colors duration-200"
                >
                    Add Item
                </Link>
            </div>

            {/* Search and filters */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4040a1] focus:ring-[#4040a1] sm:text-sm pl-10 py-2 border"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {(['all', 'tops', 'bottoms', 'outerwear', 'shoes', 'accessories'] as const).map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeCategory === category
                                    ? 'bg-[#4040a1] text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-[#4040a1]'
                                    }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Closet grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item.id}
                            className="group relative"
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-50 group-hover:opacity-75 border border-gray-100">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-sm text-gray-500">{item.name}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">{item.name}</h3>
                                    <p className="mt-1 text-sm text-gray-500 capitalize">{item.color}</p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="inline-flex items-center rounded-full bg-[#4040a1]/10 px-2.5 py-0.5 text-xs font-medium text-[#4040a1] capitalize">
                                    {item.occasion}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white">
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
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchQuery ? 'Try a different search query or category filter.' : 'Get started by adding items to your closet.'}
                    </p>
                    {!searchQuery && (
                        <div className="mt-6">
                            <Link
                                href="/closet/add"
                                className="inline-flex items-center rounded-md border border-transparent bg-[#4040a1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#333380] transition-colors duration-200"
                            >
                                Add Item
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Stats */}
            <div className="mt-12 bg-[#4040a1]/5 p-6 rounded-lg">
                <h2 className="text-lg font-medium text-[#4040a1] mb-4">Closet Stats</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                        <div className="px-4 py-5 sm:p-6">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{clothingItems.length}</dd>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                        <div className="px-4 py-5 sm:p-6">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Most Common Category</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900 capitalize">Outerwear</dd>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                        <div className="px-4 py-5 sm:p-6">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Color Palette</dt>
                                <dd className="mt-1 flex gap-1">
                                    <span className="h-6 w-6 rounded-full bg-black"></span>
                                    <span className="h-6 w-6 rounded-full bg-blue-600"></span>
                                    <span className="h-6 w-6 rounded-full bg-white border"></span>
                                    <span className="h-6 w-6 rounded-full bg-gray-400"></span>
                                    <span className="h-6 w-6 rounded-full bg-red-600"></span>
                                </dd>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                        <div className="px-4 py-5 sm:p-6">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Outfit Potential</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">25+</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </motion.main>
    );
} 