'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/client';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                router.push('/dashboard');
            }
        });
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Completing authentication...</p>
        </div>
    );
}