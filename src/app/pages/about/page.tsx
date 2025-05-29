'use client';

import { useState } from 'react';
import Head from 'next/head';

const AboutPage = () => {
    const [activeTab, setActiveTab] = useState('mission');

    return (
        <>
            <Head>
                <title>About Memora - Your AI Study Assistant</title>
                <meta name="description" content="Learn about Memora's mission to revolutionize learning with AI-powered study tools" />
            </Head>

            <div className="bg-white">
                {/* Hero Section */}
                <div className="relative bg-indigo-50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Revolutionizing Learning with AI
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Memora combines cutting-edge artificial intelligence with cognitive science to help students learn faster and retain more.
                        </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Story Tabs */}
                    <div className="mb-12">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('mission')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'mission' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Our Mission
                                </button>
                                <button
                                    onClick={() => setActiveTab('story')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'story' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Our Story
                                </button>
                                <button
                                    onClick={() => setActiveTab('team')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'team' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Our Team
                                </button>
                                <button
                                    onClick={() => setActiveTab('technology')}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'technology' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Our Technology
                                </button>
                            </nav>
                        </div>

                        <div className="py-8">
                            {activeTab === 'mission' && (
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Making Learning Effortless</h2>
                                        <p className="text-lg text-gray-600 mb-4">
                                            At Memora, we believe everyone deserves access to personalized, effective learning tools. Our mission is to democratize education through AI that adapts to how you learn best.
                                        </p>
                                        <p className="text-lg text-gray-600 mb-4">
                                            We're transforming passive studying into active learning experiences that stick.
                                        </p>
                                        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                                            <p className="text-indigo-800 font-medium">
                                                "Education is not the learning of facts, but the training of minds to think." — Albert Einstein
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video">
                                        {/* Placeholder for mission video or image */}
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100">
                                            <span className="text-gray-500">Mission visualization</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'story' && (
                                <div className="space-y-12">
                                    <div className="grid md:grid-cols-2 gap-8 items-center">
                                        <div className="order-2 md:order-1">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">From Classroom Frustration to Innovation</h3>
                                            <p className="text-gray-600 mb-4">
                                                Memora was founded in 2022 by a team of former students who struggled with inefficient study methods. After acing exams using custom-built learning tools, we realized these solutions could help millions.
                                            </p>
                                            <p className="text-gray-600">
                                                What started as a university project is now helping students in 84 countries study smarter.
                                            </p>
                                        </div>
                                        <div className="order-1 md:order-2 bg-gray-100 rounded-xl overflow-hidden aspect-square">
                                            {/* Founders image placeholder */}
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100">
                                                <span className="text-gray-500">Founders photo</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 pt-8">
                                        <div className="bg-indigo-50 p-6 rounded-lg">
                                            <div className="text-indigo-600 font-bold text-3xl mb-2">10K+</div>
                                            <div className="text-gray-700">Active users</div>
                                        </div>
                                        <div className="bg-indigo-50 p-6 rounded-lg">
                                            <div className="text-indigo-600 font-bold text-3xl mb-2">84</div>
                                            <div className="text-gray-700">Countries served</div>
                                        </div>
                                        <div className="bg-indigo-50 p-6 rounded-lg">
                                            <div className="text-indigo-600 font-bold text-3xl mb-2">1.2M</div>
                                            <div className="text-gray-700">Notes processed</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'team' && (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet the Minds Behind Memora</h2>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {[
                                            { name: 'Alex Chen', role: 'CEO & Co-Founder', expertise: 'AI Research', img: '/team/alex.jpg' },
                                            { name: 'Jamila Kone', role: 'CTO', expertise: 'Machine Learning', img: '/team/jamila.jpg' },
                                            { name: 'Ryan Park', role: 'Head of Product', expertise: 'EdTech', img: '/team/ryan.jpg' },
                                            { name: 'Maya Santos', role: 'Lead Designer', expertise: 'Learning Science', img: '/team/maya.jpg' },
                                        ].map((member, index) => (
                                            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                                                <div className="aspect-square bg-gray-100">
                                                    {/* Team member image placeholder */}
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100">
                                                        <span className="text-gray-500">Photo</span>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                                    <p className="text-indigo-600 mb-2">{member.role}</p>
                                                    <p className="text-gray-600 text-sm">{member.expertise}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'technology' && (
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Advanced Learning Intelligence</h2>
                                        <p className="text-lg text-gray-600 mb-4">
                                            Memora combines state-of-the-art natural language processing with cognitive science principles to create personalized learning experiences.
                                        </p>
                                        <ul className="space-y-3 mb-6">
                                            <li className="flex items-start">
                                                <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Transformer-based knowledge extraction</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Spaced repetition algorithms</span>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">Adaptive learning pathways</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                                        {/* Tech visualization placeholder */}
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100">
                                            <span className="text-gray-500">Technology visualization</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="py-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Learning First',
                                    icon: '📚',
                                    description: 'Every feature is designed with cognitive science principles to maximize knowledge retention.'
                                },
                                {
                                    title: 'Student-Centric',
                                    icon: '🎯',
                                    description: 'We build tools that adapt to how you learn, not the other way around.'
                                },
                                {
                                    title: 'Ethical AI',
                                    icon: '🤖',
                                    description: 'Transparent algorithms that respect your privacy and data rights.'
                                },
                            ].map((value, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="text-4xl mb-4">{value.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-indigo-600 rounded-xl p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Transform Your Learning?</h2>
                        <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                            Join thousands of students who are already studying smarter with Memora.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="/signup"
                                className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Start Free Trial
                            </a>
                            <a
                                href="/demo"
                                className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                See Demo
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutPage;