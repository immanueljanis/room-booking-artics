'use client';

import { useSelector } from 'react-redux';
import AuthGuard from '@/providers/AuthGuard';

export default function DashboardPage() {
    const { data: user, status } = useSelector((state) => state.user);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">Loading...</span>
            </div>
        );
    }

    return (
        <AuthGuard allowedRoles={['admin', 'super_admin', 'user']}>
            <div>
                <h1 className="text-3xl font-semibold mb-4">
                    Welcome, <span className="capitalize">{user?.data?.name || 'User'}</span>
                </h1>
                <p className="text-gray-600">
                    This is your dashboard. Use the menu on the left to navigate.
                </p>
            </div>
        </AuthGuard>
    );
}