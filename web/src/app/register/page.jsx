'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CiMail, CiLock, CiUser } from "react-icons/ci";
import { Toaster } from 'react-hot-toast';

import { registerUserSchema } from '@/schema/user';
import { apiRequest } from '@/services/apiRequest';
import { notifySuccess, notifyError } from '@/utils/notifications';

export default function Register() {
    const router = useRouter();
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
        resolver: yupResolver(registerUserSchema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await apiRequest({
                url: '/user/register',
                method: 'POST',
                needAuth: false,
                body: data,
            });
            notifySuccess('Registrasi berhasil! Silakan login.');
            router.push('/login');
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
                    <div className="flex items-center p-6 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white">
                        <CiUser className="w-8 h-8 mr-2" />
                        <h1 className="text-xl font-semibold">Buat Akun Baru</h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5" noValidate>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <div className="relative">
                                <CiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className={`w-full pl-10 pr-3 py-2 border rounded
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                            <div className="relative">
                                <CiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    id="name"
                                    type="name"
                                    {...register('name')}
                                    className={`w-full pl-10 pr-3 py-2 border rounded
                        ${errors.name ? 'border-red-500' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="Nama user"
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                            <div className="relative">
                                <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className={`w-full pl-10 pr-3 py-2 border rounded
                        ${errors.password ? 'border-red-500' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-2 px-4 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 disabled:opacity-50 transition"
                        >
                            {loading ? 'Mendaftarkan…' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <div className="p-4 text-center text-sm text-gray-600">
                        Sudah punya akun?{' '}
                        <button onClick={() => router.push('/login')} className="text-indigo-600 hover:underline">
                            Masuk di sini
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
