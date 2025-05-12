'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full border-b bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-24 items-center justify-between">
                    <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/" className="flex items-center group">
                            <motion.span
                                className="text-4xl font-extrabold tracking-tight transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="text-[#4040a1] group-hover:text-[#333380]">Libas</span>
                                <span className="bg-[#4040a1] text-white px-1 rounded group-hover:bg-[#333380]">AI</span>
                            </motion.span>
                        </Link>
                    </motion.div>

                    {/* Desktop navigation */}
                    <motion.nav
                        className="hidden md:flex items-center space-x-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Link href="/dashboard" className="text-base font-medium text-gray-700 hover:text-[#4040a1] transition-colors hover:scale-105 transform duration-200">
                            Dashboard
                        </Link>
                        <Link href="/closet" className="text-base font-medium text-gray-700 hover:text-[#4040a1] transition-colors hover:scale-105 transform duration-200">
                            My Closet
                        </Link>
                        <Link href="/outfit" className="text-base font-medium text-gray-700 hover:text-[#4040a1] transition-colors hover:scale-105 transform duration-200">
                            Create Outfit
                        </Link>
                    </motion.nav>

                    <motion.div
                        className="hidden md:flex items-center space-x-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link
                            href="/login"
                            className="text-base font-medium text-gray-700 hover:text-[#4040a1] transition-colors hover:scale-105 transform duration-200"
                        >
                            Sign In
                        </Link>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/signup"
                                className="inline-flex h-11 items-center justify-center rounded-md bg-[#4040a1] px-6 text-base font-medium text-white transition-colors hover:bg-[#333380] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4040a1] disabled:pointer-events-none disabled:opacity-50 shadow-sm"
                            >
                                Sign Up
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Mobile menu button */}
                    <motion.div
                        className="md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-[#4040a1] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4040a1]"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <motion.div
                    className="md:hidden bg-white"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                        <Link
                            href="/dashboard"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#4040a1] transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/closet"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#4040a1] transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            My Closet
                        </Link>
                        <Link
                            href="/outfit"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#4040a1] transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Create Outfit
                        </Link>
                    </div>
                    <div className="border-t border-gray-200 pb-3 pt-4">
                        <div className="space-y-1 px-2">
                            <Link
                                href="/login"
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#4040a1] transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="block rounded-md px-3 py-2 text-base font-medium bg-[#4040a1]/10 text-[#4040a1] hover:bg-[#4040a1]/20 transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </header>
    );
} 