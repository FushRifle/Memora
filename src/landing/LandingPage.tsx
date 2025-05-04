import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const MemoraLandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Head>
                <title>Memora: AI Study Assistant | Smarter Learning, Better Grades</title>
                <meta name="description" content="Transform your study sessions with AI-powered note parsing, smart summarization, quiz generation, and personalized tutoring." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Navigation */}
            <nav className="px-6 py-4 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">M</span>
                        </div>
                        <span className="text-xl font-bold text-indigo-600">Memora</span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600">How It Works</a>
                        <a href="#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</a>
                        <a href="#testimonials" className="text-gray-600 hover:text-indigo-600">Testimonials</a>
                    </div>
                    <Link href="/auth/Signin">
                        <button className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                            Get Started
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-12 md:mb-0">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Your AI-Powered <span className="text-indigo-600">Study Assistant</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Transform your study sessions with smart note parsing, automatic summarization, quiz generation, and personalized tutoring—all powered by AI.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium">
                            Start Free Trial
                        </button>
                        <button className="cursor-pointer border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors text-lg font-medium">
                            See How It Works
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-md">
                        <div className="absolute -top-6 -left-6 w-64 h-64 bg-indigo-100 rounded-xl opacity-70"></div>
                        <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-100 rounded-xl opacity-70"></div>
                        <div className="relative bg-white p-4 rounded-xl shadow-xl border border-gray-100">
                            <div className="bg-gray-800 rounded-lg overflow-hidden">
                                <div className="p-3 bg-gray-700 flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="p-4">
                                    <div className="text-white font-mono">
                                        <p className="text-green-400">Memora AI:</p>
                                        <p className="mt-2">Here's a summary of your uploaded lecture:</p>
                                        <ul className="mt-2 ml-5 list-disc">
                                            <li>Photosynthesis converts light to chemical energy</li>
                                            <li>Occurs in chloroplasts of plant cells</li>
                                            <li>Two stages: light-dependent & Calvin cycle</li>
                                        </ul>
                                        <p className="mt-4">Would you like me to generate quiz questions or explain any concepts further?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="max-w-7xl mx-auto px-6 py-16 bg-white">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Effective Learning</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Memora combines advanced AI with proven learning techniques to help you study smarter, not harder.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Note Upload & Parsing</h3>
                        <p className="text-gray-600">
                            Upload PDFs, DOCX, screenshots, or handwritten notes. Our AI extracts and structures the content for you.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Summarization</h3>
                        <p className="text-gray-600">
                            Get concise summaries in your preferred format - bullet points, TL;DR, or flashcards for quick review.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz & Test Generator</h3>
                        <p className="text-gray-600">
                            Practice with AI-generated MCQs, fill-in-the-blank, and short answer questions tailored to your material.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Chat Tutor</h3>
                        <p className="text-gray-600">
                            Ask questions about your material and get explanations from an AI tutor trained on your specific content.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Study Schedule Builder</h3>
                        <p className="text-gray-600">
                            Automatic study calendar creation that integrates with Google Calendar and Notion for seamless planning.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracker</h3>
                        <p className="text-gray-600">
                            Visualize your learning journey with completion metrics, test scores, and gamification elements.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How Memora Works</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Transform your study materials into an interactive learning experience in just a few steps
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Notes</h3>
                        <p className="text-gray-600">Add PDFs, DOCX, images, or handwritten notes</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Processes Content</h3>
                        <p className="text-gray-600">Extracts key concepts and structures information</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Learning Tools</h3>
                        <p className="text-gray-600">Select summaries, quizzes, or schedule planning</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">4</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Smarter</h3>
                        <p className="text-gray-600">Achieve better results in less time</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="max-w-7xl mx-auto px-6 py-16 bg-white">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">What Students Are Saying</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join thousands of students who improved their grades with Memora
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-indigo-600 font-bold">A</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Alex M.</h4>
                                <p className="text-gray-600">Medical Student</p>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            "Memora cut my study time in half while improving my test scores. The quiz generator is incredibly accurate to what appears on exams."
                        </p>
                        <div className="flex mt-4">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-indigo-600 font-bold">S</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Sarah K.</h4>
                                <p className="text-gray-600">Engineering Student</p>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            "The AI tutor understands my questions better than my actual professors. It's like having a personal teacher available 24/7."
                        </p>
                        <div className="flex mt-4">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-indigo-600 font-bold">J</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Jamal R.</h4>
                                <p className="text-gray-600">Law Student</p>
                            </div>
                        </div>
                        <p className="text-gray-700">
                            "I went from B's to A's after using Memora. The case brief summaries and practice questions are perfect for law school prep."
                        </p>
                        <div className="flex mt-4">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Study Habits?</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Join thousands of students who are studying smarter and achieving better grades with Memora.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium">
                            Start Free Trial
                        </button>
                        <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">M</span>
                                </div>
                                <span className="text-xl font-bold text-white">Memora</span>
                            </div>
                            <p className="mb-4">
                                AI-powered study assistant helping students learn more effectively.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white">Features</a></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                                <li><a href="#" className="hover:text-white">API</a></li>
                                <li><a href="#" className="hover:text-white">Integrations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Privacy</a></li>
                                <li><a href="#" className="hover:text-white">Terms</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white">Help Center</a></li>
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white">Status</a></li>
                                <li><a href="#" className="hover:text-white">Feedback</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p>&copy; {new Date().getFullYear()} Memora AI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MemoraLandingPage;