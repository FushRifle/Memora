// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Auth protected routes
    if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Prevent logged-in users from accessing auth pages
    if (session && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}