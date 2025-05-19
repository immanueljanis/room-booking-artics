'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { adminRegisterSchema } from '@/schema/admin';
import { useForm } from 'react-hook-form';
import { apiRequest } from '@/services/apiRequest';
import { Toaster } from 'react-hot-toast';
import { notifySuccess, notifyError } from '@/utils/notifications';

export default function AdminRegisterPage() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const user = await apiRequest({
                    url: '/auth/whoami',
                    method: 'GET',
                    needAuth: true,
                });
                if (user?.data?.role !== 'super_admin') {
                    notifyError('Hanya Super Admin yang dapat mendaftar Admin baru');
                    router.replace('/dashboard');
                }
            } catch {
                router.replace('/admin/login');
            }
        })();
    }, [router]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(adminRegisterSchema),
    });

    const onSubmit = async (data) => {
        try {
            await apiRequest({
                url: '/admin/register',
                method: 'POST',
                needAuth: true,
                body: data,
            });
            notifySuccess('Admin berhasil didaftarkan');
            router.push('/dashboard');
        } catch (err) {
            notifyError(err.message);
        }
    };

    return (
        <>
            <Toaster />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded shadow">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Register Admin Baru
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Nama
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name')}
                                className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {errors.name && (
                                <p className="mt-1 text-red-500 text-sm">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-red-500 text-sm">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className={`w-full px-3 py-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-red-500 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Mendaftarkan...' : 'Daftarkan Admin'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
