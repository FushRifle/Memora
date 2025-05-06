'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/client';
import Link from 'next/link';
import Head from 'next/head';

export default function EmailConfirmation() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    const email = searchParams.get('email');

    useEffect(() => {
        if (token && type === 'signup') {
            confirmSignUp();
        }
    }, [token, type]);

    const confirmSignUp = async () => {
        try {
            setLoading(true);
            setError('');

            if (!token || !email) {
                throw new Error('Token or email is missing');
            }

            const { error: confirmationError } = await supabase.auth.verifyOtp({
                type: 'signup',
                token_hash: token,
                email: email,
            });

            if (confirmationError) throw confirmationError;

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Confirmation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head>
                <title>Email Confirmation | Memora</title>
            </Head>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {success ? 'Email Confirmed!' : 'Confirming Email...'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {loading && !success && (
                        <div className="text-center">
                            <div className="flex justify-center">
                                <svg
                                    className="animate-spin h-8 w-8 text-indigo-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
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
                                </svg>
                            </div>
                            <p className="mt-4 text-sm text-gray-600">Verifying your email address...</p>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Email Verification Failed</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                        <p className="mt-2">
                                            Try{' '}
                                            <Link
                                                href="/auth/signup"
                                                className="font-medium text-red-700 hover:text-red-600 underline"
                                            >
                                                signing up
                                            </Link>{' '}
                                            again or contact support if the problem persists.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-green-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">Email Verified Successfully!</h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>Your account has been successfully verified.</p>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href="/dashboard"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && !success && !error && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                No verification token found. Please check your email for the confirmation link.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/auth/signin"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Return to sign in
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}