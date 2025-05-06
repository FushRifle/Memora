import { Suspense } from 'react';
import EmailConfirmation from './EmailConfirmation';

export default function ConfirmPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">
            Verifying email...
        </div>}>
            <EmailConfirmation />
        </Suspense>
    );
}
