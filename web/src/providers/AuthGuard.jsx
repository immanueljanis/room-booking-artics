'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function AuthGuard({ children, allowedRoles = [] }) {
    const router = useRouter();
    const { data: user, status } = useSelector((state) => state.user);
    useEffect(() => {
        if (status === 'succeeded') {
            if (!user?.data) {
                router.replace('/login');
            }
            else if (
                allowedRoles.length > 0 &&
                !allowedRoles.includes(user?.data.role)
            ) {
                router.replace('/');
            }
        }

        if (status === 'failed') {
            router.replace('/login');
        }
    }, [status, user, router, allowedRoles]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">Loading…</span>
            </div>
        );
    }

    if (status === 'succeeded' && user) {
        return <>{children}</>;
    }

    return null;
}
