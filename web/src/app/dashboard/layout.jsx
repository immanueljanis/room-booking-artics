'use client';

import ReduxProvider from '@/providers/ReduxProviders';
import InitAuth from '@/components/initAuth';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/providers/AuthGuard';

export default function DashboardLayout({ children }) {
    return (
        <ReduxProvider>
            <InitAuth />
            <AuthGuard allowedRoles={['user', 'admin', 'super_admin']}>
                <div className="flex min-h-screen bg-gray-100">
                    <Sidebar />
                    <main className="flex-1 p-8">{children}</main>
                </div>
            </AuthGuard>
        </ReduxProvider>
    );
}
