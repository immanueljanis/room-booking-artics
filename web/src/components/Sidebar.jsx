'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Sidebar() {
    const pathname = usePathname();

    const { data: user, status } = useSelector((state) => state.user);

    if (status === 'loading') {
        return (
            <div className="w-64 bg-white border-r p-6">
                <p className="text-gray-500">Loading menu…</p>
            </div>
        );
    }

    if (!user?.data) return null;

    const menusByRole = {
        super_admin: [
            { label: 'Bookings', href: '/admin/bookings' },
            { label: 'Master Room Features', href: '/admin/features' },
            { label: 'Master Rooms', href: '/admin/rooms' },
            { label: 'Master Users', href: '/admin/users' },
            { label: 'Master Admins', href: '/admin/admins' },
        ],
        admin: [
            { label: 'Bookings', href: '/admin/bookings' },
            { label: 'Room Features', href: '/admin/features' },
            { label: 'Rooms', href: '/admin/rooms' },
            { label: 'Users', href: '/admin/users' },
        ],
        user: [
            { label: 'Available Rooms', href: '/dashboard/rooms' },
            { label: 'My Booking History', href: '/dashboard/history' },
        ],
    };

    const items = menusByRole[user?.data?.role] || [];

    return (
        <nav className="w-64 bg-white border-r min-h-screen">
            <div className="px-6 py-4 border-b">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <ul>
                {items.map((item) => (
                    <li key={item.href}>
                        <Link href={item.href}
                            className={
                                "block px-6 py-3 hover:bg-gray-50 " +
                                (pathname === item.href
                                    ? 'bg-gray-200 font-semibold'
                                    : 'text-gray-700')
                            }>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
