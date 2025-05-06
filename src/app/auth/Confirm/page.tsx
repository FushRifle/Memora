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

    useEffect(() => {
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const email = searchParams.get('email');

        if (token && type === 'signup' && email) {
            const confirmSignUp = async () => {
                try {
                    setLoading(true);
                    setError('');

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

            confirmSignUp();
        } else {
            setLoading(false);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head>
                <title>Email Confirmation | Memora</title>
            </Head>

            {/* ... (Your JSX stays the same) */}
        </div>
    );
}
