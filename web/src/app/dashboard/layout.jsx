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
                <div>
                    <Sidebar />
                    <main>{children}</main>
                </div>
            </AuthGuard>
        </ReduxProvider>
    );
}
