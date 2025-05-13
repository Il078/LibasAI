'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Dummy data for AI insights
const DEMO_INSIGHTS = {
    styleAnalysis: {
        dominantStyle: 'Casual',
        styleBreakdown: [
            { style: 'Casual', percentage: 65 },
            { style: 'Formal', percentage: 15 },
            { style: 'Business', percentage: 10 },
            { style: 'Athletic', percentage: 5 },
            { style: 'Bohemian', percentage: 5 }
        ],
        recommendations: [
            "Your wardrobe is heavily casual. Consider adding a few statement formal pieces for special occasions.",
            "You could benefit from some athleisure items for a more versatile collection.",
            "Your color palette is well-balanced, but adding a few accent colors could enhance your options."
        ]
    },
    colorAnalysis: {
        dominantColors: [
            { color: 'Blue', hex: '#1E40AF', percentage: 30 },
            { color: 'Black', hex: '#111827', percentage: 25 },
            { color: 'White', hex: '#F9FAFB', percentage: 20 },
            { color: 'Gray', hex: '#6B7280', percentage: 15 },
            { color: 'Red', hex: '#DC2626', percentage: 10 }
        ],
        colorHarmony: 'Balanced',
        colorRecommendations: [
            "Your wardrobe has a nice balance of neutral colors. Consider adding accent colors like yellow or green.",
            "For your skin tone, warm colors like coral and amber would complement well.",
            "To maximize outfit combinations, adding more neutral bottoms would be beneficial."
        ]
    },
    seasonalAnalysis: {
        seasonBreakdown: [
            { season: 'Spring', percentage: 15 },
            { season: 'Summer', percentage: 30 },
            { season: 'Fall', percentage: 40 },
            { season: 'Winter', percentage: 15 }
        ],
        gapsIdentified: [
            "Your winter collection is limited, consider adding more cold-weather items.",
            "Your spring collection could use more variety in tops.",
            "You have a strong fall wardrobe with good variety."
        ],
        seasonalRecommendations: [
            {
                season: 'Winter',
                items: ['Wool coat', 'Heavy sweaters', 'Thermal layers']
            },
            {
                season: 'Spring',
                items: ['Light jackets', 'Colorful blouses', 'Midi skirts']
            }
        ]
    },
    outfitSuggestions: [
        {
            occasion: 'Work',
            items: [
                { name: 'White button-up shirt', image: 'https://images.unsplash.com/photo-1561303009-9a78d8de449a?q=80&w=300' },
                { name: 'Navy blazer', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300' },
                { name: 'Gray slacks', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869ebb?q=80&w=300' }
            ]
        },
        {
            occasion: 'Casual Outing',
            items: [
                { name: 'Blue jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=300' },
                { name: 'White t-shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=300' },
                { name: 'Leather jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=300' }
            ]
        }
    ],
    fashionTrendMatch: {
        currentTrends: [
            { trend: 'Oversized silhouettes', match: 'Low', suggestion: 'Try adding some oversized sweaters or jackets' },
            { trend: 'Sustainable fashion', match: 'Medium', suggestion: 'Your wardrobe has some eco-friendly items, but could use more' },
            { trend: 'Neutral tones', match: 'High', suggestion: 'Your neutral palette is on-trend' },
            { trend: 'Statement accessories', match: 'Low', suggestion: 'Consider bold accessories to elevate outfits' }
        ]
    }
};

export default function AIInsights() {
    const [insightsData, setInsightsData] = useState(DEMO_INSIGHTS);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('style');

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

    // In a real app, this would fetch data from an API
    useEffect(() => {
        setLoading(true);
        // Simulate API fetch delay
        setTimeout(() => {
            setInsightsData(DEMO_INSIGHTS);
            setLoading(false);
        }, 1500);
    }, []);

    const renderColorBar = (color: string, percentage: number) => (
        <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-full rounded-full"
                style={{
                    width: `${percentage}%`,
                    backgroundColor: color
                }}
            ></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#4040a1]">AI Wardrobe Insights</h1>
                    <p className="mt-2 text-gray-600">
                        Advanced analysis of your closet using DeepFashion and CLIP models
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'style' ? 'bg-[#4040a1] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setActiveTab('style')}
                    >
                        Style Analysis
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'color' ? 'bg-[#4040a1] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setActiveTab('color')}
                    >
                        Color Analysis
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'seasonal' ? 'bg-[#4040a1] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setActiveTab('seasonal')}
                    >
                        Seasonal Analysis
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'outfits' ? 'bg-[#4040a1] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setActiveTab('outfits')}
                    >
                        AI Outfit Suggestions
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'trends' ? 'bg-[#4040a1] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setActiveTab('trends')}
                    >
                        Trend Analysis
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <motion.svg
                        className="h-10 w-10 text-[#4040a1]"
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
                </div>
            ) : (
                <div className="mt-8">
                    {activeTab === 'style' && (
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div
                                className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm"
                                variants={item}
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Style Distribution</h2>
                                <div className="space-y-4">
                                    {insightsData.styleAnalysis.styleBreakdown.map((style) => (
                                        <div key={style.style} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>{style.style}</span>
                                                <span>{style.percentage}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-[#4040a1]"
                                                    style={{ width: `${style.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Dominant Style</h3>
                                    <div className="inline-block px-4 py-2 bg-[#4040a1]/10 text-[#4040a1] rounded-full font-medium">
                                        {insightsData.styleAnalysis.dominantStyle}
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                className="bg-white p-6 rounded-lg shadow-sm"
                                variants={item}
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Style Recommendations</h2>
                                <ul className="space-y-3">
                                    {insightsData.styleAnalysis.recommendations.map((recommendation, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <span className="inline-flex items-center justify-center h-6 w-6 bg-[#4040a1]/10 text-[#4040a1] rounded-full text-sm mr-2 flex-shrink-0">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm text-gray-700">{recommendation}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6">
                                    <button className="w-full px-4 py-2 bg-[#4040a1] text-white rounded-md hover:bg-[#333380] transition-colors">
                                        Get Personalized Style Tips
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'color' && (
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div
                                className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm"
                                variants={item}
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Color Palette Analysis</h2>
                                <div className="space-y-6">
                                    {insightsData.colorAnalysis.dominantColors.map((color) => (
                                        <div key={color.color} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div
                                                        className="h-6 w-6 rounded-full mr-2"
                                                        style={{ backgroundColor: color.hex }}
                                                    ></div>
                                                    <span className="text-sm font-medium">{color.color}</span>
                                                </div>
                                                <span className="text-sm text-gray-500">{color.percentage}%</span>
                                            </div>
                                            {renderColorBar(color.hex, color.percentage)}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-800">Color Harmony</h3>
                                    <div className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        {insightsData.colorAnalysis.colorHarmony}
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                className="bg-white p-6 rounded-lg shadow-sm"
                                variants={item}
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Color Recommendations</h2>
                                <ul className="space-y-3">
                                    {insightsData.colorAnalysis.colorRecommendations.map((recommendation, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 pb-2 border-b border-gray-100">
                                            {recommendation}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 text-center">
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">Suggested Colors to Add</h3>
                                    <div className="flex justify-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-amber-500" title="Amber"></div>
                                        <div className="h-10 w-10 rounded-full bg-emerald-500" title="Emerald"></div>
                                        <div className="h-10 w-10 rounded-full bg-violet-500" title="Violet"></div>
                                        <div className="h-10 w-10 rounded-full bg-rose-400" title="Coral"></div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'seasonal' && (
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div
                                className="bg-white p-6 rounded-lg shadow-sm"
                                variants={item}
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Seasonal Distribution</h2>
                                <div className="h-64 w-full relative">
                                    {/* This would be a chart in a real implementation */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-gray-100 rounded-full h-48 w-48 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-[#4040a1]">Fall</div>
                                                <div className="text-sm text-gray-500">Dominant Season</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Donut chart segments would go here */}
                                    <div className="absolute top-0 right-0">
                                        <div className="space-y-2">
                                            {insightsData.seasonalAnalysis.seasonBreakdown.map((season) => (
                                                <div key={season.season} className="flex items-center text-sm">
                                                    <div className={`h-3 w-3 rounded-full mr-2 ${season.season === 'Spring' ? 'bg-green-400' :
                                                            season.season === 'Summer' ? 'bg-yellow-400' :
                                                                season.season === 'Fall' ? 'bg-orange-400' :
                                                                    'bg-blue-400'
                                                        }`}></div>
                                                    <span>{season.season}: {season.percentage}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm"
                                variants={item}
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Seasonal Gaps & Recommendations</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Identified Gaps</h3>
                                        <ul className="space-y-2">
                                            {insightsData.seasonalAnalysis.gapsIdentified.map((gap, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="inline-flex items-center justify-center h-5 w-5 bg-red-100 text-red-600 rounded-full text-xs mr-2 flex-shrink-0">
                                                        !
                                                    </span>
                                                    <span className="text-sm text-gray-700">{gap}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-3">Suggested Items</h3>
                                        {insightsData.seasonalAnalysis.seasonalRecommendations.map((rec) => (
                                            <div key={rec.season} className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">For {rec.season}:</h4>
                                                <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                                    {rec.items.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <button className="w-full px-4 py-2 bg-[#4040a1] text-white rounded-md hover:bg-[#333380] transition-colors">
                                        Browse Recommended Seasonal Items
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'outfits' && (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.h2
                                className="text-xl font-semibold text-gray-800 mb-6"
                                variants={item}
                            >
                                AI-Generated Outfit Combinations
                            </motion.h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {insightsData.outfitSuggestions.map((outfit, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="bg-white p-6 rounded-lg shadow-sm"
                                        variants={item}
                                    >
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                                            For: <span className="text-[#4040a1]">{outfit.occasion}</span>
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {outfit.items.map((item, itemIdx) => (
                                                <div key={itemIdx} className="space-y-2">
                                                    <div className="aspect-square relative rounded overflow-hidden">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-center text-gray-700">{item.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <button className="text-sm text-[#4040a1] hover:underline">
                                                Save Outfit
                                            </button>
                                            <button className="text-sm text-[#4040a1] hover:underline">
                                                See Alternatives
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.div
                                className="mt-8 bg-[#4040a1]/5 p-6 rounded-lg"
                                variants={item}
                            >
                                <div className="flex flex-col md:flex-row justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">Create Custom AI Outfit</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Let AI create a perfect outfit for a specific occasion
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <Link
                                            href="/outfit?ai=true"
                                            className="inline-block px-6 py-3 bg-[#4040a1] text-white rounded-md hover:bg-[#333380] transition-colors"
                                        >
                                            Try AI Outfit Creator
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'trends' && (
                        <motion.div
                            className="grid grid-cols-1 gap-8"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div
                                className="bg-white p-6 rounded-lg shadow-sm"
                                variants={item}
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Fashion Trend Analysis</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Current Trend</th>
                                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Match Level</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">AI Suggestion</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {insightsData.fashionTrendMatch.currentTrends.map((trend, idx) => (
                                                <tr key={idx} className="border-b border-gray-100">
                                                    <td className="px-4 py-4 text-sm text-gray-800">{trend.trend}</td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex justify-center">
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${trend.match === 'High' ? 'bg-green-100 text-green-800' :
                                                                    trend.match === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-red-100 text-red-800'
                                                                }`}>
                                                                {trend.match}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{trend.suggestion}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                            <motion.div
                                className="bg-white p-6 rounded-lg shadow-sm"
                                variants={item}
                            >
                                <div className="flex flex-col md:flex-row justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <h2 className="text-xl font-semibold text-gray-800">Upcoming Trend Forecast</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            AI analysis of fashion forecasts and runways for the upcoming season
                                        </p>
                                    </div>
                                    <button className="px-4 py-2 bg-[#4040a1] text-white rounded-md hover:bg-[#333380] transition-colors">
                                        Generate Forecast
                                    </button>
                                </div>
                                <div className="mt-6 p-8 bg-gray-50 rounded-lg text-center">
                                    <p className="text-gray-500">
                                        Generate a trend forecast to see what styles will be popular in the upcoming season and how they match with your wardrobe
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
} 