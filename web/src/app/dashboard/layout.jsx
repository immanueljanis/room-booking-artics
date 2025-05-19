'use client';

import AuthGuard from '@/providers/AuthGuard';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
    return (
        <AuthGuard allowedRoles={['user', 'admin', 'super_admin']}>
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[16rem_1fr]">
                <Sidebar />

                <main className="bg-gray-100 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
