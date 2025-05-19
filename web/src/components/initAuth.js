'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchWhoAmI } from '@/store/userSlice';

export default function InitAuth() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchWhoAmI());
    }, [dispatch]);
    return null;
}
