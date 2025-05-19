'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CiMail, CiLock, CiUser } from "react-icons/ci";
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { loginUserSchema } from '@/schema/user';
import { apiRequest } from '@/services/apiRequest';
import { notifySuccess, notifyError } from '@/utils/notifications';
import { fetchWhoAmI } from '@/store/userSlice';

export default function UserLoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

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
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginUserSchema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await apiRequest({
                url: '/user/login',
                method: 'POST',
                needAuth: true,
                body: data,
            });

            // 2) Populate Redux with the new session
            await dispatch(fetchWhoAmI()).unwrap();

            notifySuccess('Login berhasil!');
            router.push('/dashboard');
        } catch (err) {
            notifyError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center p-6 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white">
                        <CiUser className="w-8 h-8 mr-2" />
                        <h1 className="text-xl font-semibold">User Login</h1>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-6 space-y-5"
                        noValidate
                    >
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <CiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className={`w-full pl-10 pr-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-red-500 text-sm">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className={`w-full pl-10 pr-3 py-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-red-500 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-2 px-4 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {loading ? 'Logging in…' : 'Masuk Sekarang'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="p-4 text-center text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <button
                            onClick={() => router.push('/register')}
                            className="text-indigo-600 hover:underline"
                        >
                            Daftar di sini
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}