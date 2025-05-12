'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#4040a1]">
                  Your Personal AI Stylist
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  Discover perfect outfit combinations, get personalized style recommendations, and elevate your fashion game with LibasAI.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/dashboard"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#4040a1] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#333380] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4040a1] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Get Started
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/#features"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#4040a1] bg-white px-8 text-sm font-medium text-[#4040a1] shadow-sm transition-colors hover:bg-gray-100 hover:text-[#333380] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4040a1] disabled:pointer-events-none disabled:opacity-50"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-xl">
                <Image
                  src="/outfit-hero.png"
                  alt="LibasAI Hero"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-xl"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#4040a1]">Features</h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover how LibasAI makes styling effortless
              </p>
            </div>
          </motion.div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4040a1]/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4040a1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16.2 7.8 2 22" />
                  <path d="m22 2-5.8 5.8" />
                </svg>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold text-[#4040a1]">Outfit Matching</h3>
                <p className="text-sm text-gray-600">
                  Upload one item and discover perfectly matched pieces to complete your look.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4040a1]/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4040a1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" />
                  <path d="M2 13h10" />
                  <path d="m9 16 3-3-3-3" />
                </svg>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold text-[#4040a1]">Virtual Closet</h3>
                <p className="text-sm text-gray-600">
                  Organize your wardrobe digitally and access your clothes from anywhere.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4040a1]/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4040a1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M20 4v5l-9 7-9-7V4" />
                  <path d="M2 4h20" />
                  <path d="M11 4v7.3" />
                </svg>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-bold text-[#4040a1]">AI Style Recommendations</h3>
                <p className="text-sm text-gray-600">
                  Get personalized outfit suggestions based on your style preferences, occasion, and weather.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#4040a1]/5">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#4040a1]">
                Ready to Transform Your Styling Experience?
              </h2>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Join our waitlist to get early access to LibasAI.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <motion.form
                className="flex space-x-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <input
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4040a1] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  type="email"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#4040a1] px-4 text-sm font-medium text-white transition-colors hover:bg-[#333380] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4040a1] disabled:pointer-events-none disabled:opacity-50"
                >
                  Join Waitlist
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:gap-8 md:px-6">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2023 LibasAI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:text-[#4040a1] hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-[#4040a1] hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
