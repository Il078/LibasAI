import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Logo header */}
            <div className="flex h-16 items-center px-6 border-b">
                <Link href="/" className="flex items-center">
                    <span className="text-xl font-bold">AI Outfit Designer</span>
                </Link>
            </div>

            {/* Main content */}
            {children}
        </div>
    );
} 