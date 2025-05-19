'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { adminLoginSchema } from '@/schema/admin';
import { useForm } from 'react-hook-form';
import { apiRequest } from '@/services/apiRequest';
import { Toaster } from 'react-hot-toast';
import { notifySuccess, notifyError } from '@/utils/notifications';

import { useDispatch } from 'react-redux';
import { fetchWhoAmI } from '@/store/userSlice';

export default function AdminLoginPage() {
    const router = useRouter();
    const dispatch = useDispatch()

    useEffect(() => {
        (async () => {
            try {
                await apiRequest({
                    url: '/auth/whoami',
                    method: 'GET',
                    needAuth: true,
                });
                router.push('/dashboard');
            } catch {
            }
        })();
    }, [router]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(adminLoginSchema),
    });

    const onSubmit = async (data) => {
        try {
            await apiRequest({
                url: '/admin/login',
                method: 'POST',
                needAuth: true,
                body: data,
            });

            await dispatch(fetchWhoAmI()).unwrap();

            notifySuccess('Login berhasil');
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
                    <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>

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
                                <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium mb-1">
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
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}