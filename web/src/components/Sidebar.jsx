'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineLogout, HiOutlineClipboardList, HiOutlineCollection, HiOutlineUserGroup, HiOutlineUser, HiOutlineHome, HiOutlineCog } from 'react-icons/hi';
import { clearUser } from '@/store/userSlice';
import { apiRequest } from '@/services/apiRequest';
import { notifySuccess, notifyError } from '@/utils/notifications';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: user, status } = useSelector(s => s.user);

    if (status === 'loading') {
        return (
            <div className="w-64 bg-white border-r p-6">
                <p className="text-gray-500">Loading menu…</p>
            </div>
        );
    }
    if (!user) return null;

    const menusByRole = {
        super_admin: [
            { label: 'Bookings', href: '/admin/bookings', Icon: HiOutlineHome },
            { label: 'Room Features', href: '/dashboard/features', Icon: HiOutlineCollection },
            { label: 'Rooms', href: '/admin/rooms', Icon: HiOutlineClipboardList },
            { label: 'Users', href: '/admin/users', Icon: HiOutlineUserGroup },
            { label: 'Admins', href: '/admin/admins', Icon: HiOutlineUser },
        ],
        admin: [
            { label: 'Bookings', href: '/admin/bookings', Icon: HiOutlineHome },
            { label: 'Room Features', href: '/dashboard/features', Icon: HiOutlineCollection },
            { label: 'Rooms', href: '/admin/rooms', Icon: HiOutlineClipboardList },
            { label: 'Users', href: '/admin/users', Icon: HiOutlineUserGroup },
        ],
        user: [
            { label: 'Available Rooms', href: '/dashboard/rooms', Icon: HiOutlineHome },
            { label: 'My Booking History', href: '/dashboard/history', Icon: HiOutlineClipboardList },
        ],
    };

    const items = menusByRole[user?.data?.role] || [];

    const handleLogout = async () => {
        try {
            await apiRequest({ url: '/auth/logout', method: 'POST', needAuth: true, body: {} });
            dispatch(clearUser());
            notifySuccess('Logged out');
            router.push('/');
        } catch {
            notifyError('Logout failed');
        }
    };

    return (
        <nav className="flex flex-col w-64 h-screen bg-white shadow-lg">
            {/* Header */}
            <Link href={'/dashboard'}>
                <div className="flex items-center p-6 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white">
                    <HiOutlineCog className="w-8 h-8 mr-2" />
                    <span className="text-xl font-semibold">RoomApp</span>
                </div>
            </Link>

            {/* Menu */}
            <ul className="flex-1 overflow-y-auto">
                {items.map(({ label, href, Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <li key={href}>
                            <Link href={href} className={`flex items-center px-6 py-3 transition-colors
                                ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}>
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
        </nav>
    );
}