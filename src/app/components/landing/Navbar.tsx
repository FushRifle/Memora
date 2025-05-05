'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-white shadow-md top-0 z-50 backdrop-blur-md">
            {/* Navigation */}
            <nav className="top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo and Brand */}
                        <div className="flex-shrink-0 flex items-center">
                            <div className="flex items-center">
                                <span className="text-indigo-500 text-3xl md:text-3xl font-semibold ml-3">
                                    Memora
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            {[
                                { href: '#features', label: 'Features' },
                                { href: '#how-it-works', label: 'How It Works' },
                                { href: '#pricing', label: 'Pricing' },
                                { href: '#testimonials', label: 'Testimonials' },
                                { href: '#faq', label: 'FAQs' },
                            ].map(({ href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="text-black hover:text-indigo-400 transition-colors duration-200"
                                    aria-label={`Go to ${label}`}
                                >
                                    {label}
                                </a>
                            ))}
                            <Link
                                href="/auth/Signin"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Start Free Trial
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                aria-expanded={isOpen}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            {[
                                { href: '#features', label: 'Features' },
                                { href: '#how-it-works', label: 'How It Works' },
                                { href: '#pricing', label: 'Pricing' },
                                { href: '#testimonials', label: 'Testimonials' },
                            ].map(({ href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-indigo-400 hover:bg-gray-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {label}
                                </a>
                            ))}
                            <Link
                                href="/auth/Signin"
                                className="block px-3 py-2 text-base font-medium text-indigo-400 hover:text-indigo-600 hover:bg-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    )
}
