'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { supabase } from '@/lib/client';
import { toast, ToastContainer } from 'react-toastify';
import { BsGoogle, BsGithub } from 'react-icons/bs';
import 'react-toastify/dist/ReactToastify.css';

function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) throw error;

            toast.success('Signed in successfully!');
            router.push('/dashboard');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'github' | 'google') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: `${window.location.origin}/auth/callback` }
            });
            if (error) throw error;
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Social login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
            <div className="max-w-6xl shadow-md rounded-lg justify-center items-center mx-auto w-full">
                <ToastContainer />
                <Head>
                    <title>Sign In | Memora</title>
                </Head>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <img
                            src="/images/memora.png"
                            alt="Memora Logo"
                            className="h-20 w-20"
                        />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link href="/auth/SignUp" className="font-medium text-indigo-600 hover:text-indigo-500">
                            create a new account
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-black focus:outline-none focus:text-black focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-black focus:outline-none focus:text-black focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center text-sm text-gray-900 cursor-pointer">
                                    <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                    <span className="ml-2">Remember me</span>
                                </label>
                                <Link href="/auth/Forgot" className="text-sm text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin('github')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <BsGithub />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin('google')}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <BsGoogle />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 👇 Wrap in Suspense
export default function SignInPage() {
    return (
        <Suspense fallback={<div className="text-center mt-8">Loading sign-in page...</div>}>
            <SignInForm />
        </Suspense>
    );
}
