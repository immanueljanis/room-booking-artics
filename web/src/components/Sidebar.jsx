'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
    HiOutlineMenu,
    HiOutlineLogout,
    HiOutlineClipboardList,
    HiOutlineCollection,
    HiOutlineUserGroup,
    HiOutlineUser,
    HiOutlineHome,
    HiOutlineCog
} from 'react-icons/hi';
import { clearUser } from '@/store/userSlice';
import { apiRequest } from '@/services/apiRequest';
import { notifySuccess, notifyError } from '@/utils/notifications';

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: user, status } = useSelector(s => s.user);

    // loading or unauthenticated
    if (status === 'loading' || !user) return null;

    const menusByRole = {
        super_admin: [
            { label: 'Bookings', href: '/dashboard/bookings', Icon: HiOutlineHome },
            { label: 'Features', href: '/dashboard/features', Icon: HiOutlineCollection },
            { label: 'Rooms', href: '/dashboard/rooms', Icon: HiOutlineClipboardList },
            { label: 'Users', href: '/dashboard/users', Icon: HiOutlineUserGroup },
            { label: 'Admins', href: '/dashboard/admins', Icon: HiOutlineUser },
        ],
        admin: [
            { label: 'Bookings', href: '/dashboard/bookings', Icon: HiOutlineHome },
            { label: 'Features', href: '/dashboard/features', Icon: HiOutlineCollection },
            { label: 'Rooms', href: '/dashboard/rooms', Icon: HiOutlineClipboardList },
            { label: 'Users', href: '/dashboard/users', Icon: HiOutlineUserGroup },
        ],
        user: [
            { label: 'Rooms', href: '/dashboard/rooms', Icon: HiOutlineHome },
            { label: 'History', href: '/dashboard/history', Icon: HiOutlineClipboardList },
        ],
    };

    const items = menusByRole[user?.data?.role] || [];

    const handleLogout = async () => {
        try {
            await apiRequest({ url: '/auth/logout', method: 'POST', needAuth: true });
            dispatch(clearUser());
            notifySuccess('Logged out');
            router.push('/');
        } catch {
            notifyError('Logout failed');
        }
    };

    return (
        <>
            {/* Mobile header */}
            <div className="md:hidden flex items-center justify-between bg-indigo-600 text-white px-4 py-2">
                <button onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
                    <HiOutlineMenu className="w-6 h-6" />
                </button>
                <span className="text-lg font-semibold">RoomApp</span>
            </div>

            {/* Sidebar */}
            <aside className={`${open ? 'block' : 'hidden'} md:flex flex-col w-64 h-screen bg-white shadow-lg`}>
                {/* Logo */}
                <Link href="/dashboard">
                    <div className="flex items-center p-6 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white cursor-pointer">
                        <HiOutlineCog className="w-8 h-8 mr-2" />
                        <span className="text-xl font-semibold">RoomApp</span>
                    </div>
                </Link>

                {/* Menu */}
                <ul className="flex-1 overflow-y-auto">
                    {items.map(({ label, href, Icon }) => {
                        const active = pathname === href;
                        return (
                            <li key={href}>
                                <Link className={`
                                    flex items-center px-6 py-3 transition-colors
                                        ${active ? 'bg-indigo-600 text-white' :
                                        'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`} href={href}>
                                    <Icon className="w-5 h-5 mr-3" />
                                    <span className="font-medium">{label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Logout */}
                <div className="p-6 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded transition-colors"
                    >
                        <HiOutlineLogout className="w-5 h-5 mr-2" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}