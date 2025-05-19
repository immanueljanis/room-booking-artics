'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HiPlus, HiTrash, HiSearch, HiChevronUp, HiChevronDown, HiX } from 'react-icons/hi';
import { Toaster } from 'react-hot-toast';
import { apiRequest } from '@/services/apiRequest';
import { notifySuccess, notifyError } from '@/utils/notifications';

const createSchema = yup.object({
    name: yup.string().required('Nama fitur wajib diisi'),
});

function useDebounce(value, delay = 500) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function FeaturesPage() {
    const [nameFilter, setNameFilter] = useState('');
    const debouncedName = useDebounce(nameFilter);
    const [activeFilter, setActiveFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [order, setOrder] = useState('ASC');

    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(false);

    const [modal, setModal] = useState(false);
    const {
        register, handleSubmit, reset,
        formState: { errors, isSubmitting }
    } = useForm({ resolver: yupResolver(createSchema) });

    async function fetchFeatures() {
        setLoading(true);
        try {
            const { data } = await apiRequest({
                url: '/features',
                method: 'GET',
                needAuth: true,
                params: {
                    name: debouncedName,
                    active: activeFilter,
                    sort_by: sortBy,
                    order,
                },
            });
            setFeatures(data);
        } catch (err) {
            notifyError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function load() { await fetchFeatures(); }
        load();
    }, [debouncedName, activeFilter, sortBy, order]);

    const onCreate = async vals => {
        try {
            await apiRequest({
                url: '/features',
                method: 'POST',
                needAuth: true,
                body: { name: vals.name },
            });
            notifySuccess('Fitur berhasil ditambahkan');
            reset();
            setModal(false);
            fetchFeatures();
        } catch (err) {
            notifyError(err.message);
        }
    };

    const onDelete = async id => {
        if (!confirm('Yakin menghapus fitur ini?')) return;
        try {
            await apiRequest({
                url: `/features/${id}`,
                method: 'DELETE',
                needAuth: true,
            });
            notifySuccess('Fitur berhasil dihapus');
            fetchFeatures();
        } catch (err) {
            notifyError(err.message);
        }
    };

    const onSort = field => {
        if (sortBy === field) setOrder(o => (o === 'ASC' ? 'DESC' : 'ASC'));
        else {
            setSortBy(field);
            setOrder('ASC');
        }
    };

    const filterChips = useMemo(() => {
        const chips = [];
        if (debouncedName) {
            chips.push({ label: `Name: ${debouncedName}`, clear: () => setNameFilter('') });
        }
        if (activeFilter === '1' || activeFilter === '0') {
            chips.push({
                label: `Active: ${activeFilter === '1' ? 'Yes' : 'No'}`,
                clear: () => setActiveFilter(''),
            });
        }
        return chips;
    }, [debouncedName, activeFilter]);

    return (
        <div className="p-4 md:p-8 bg-white rounded shadow space-y-6">
            <Toaster />

            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                    <HiSearch className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Filter name..."
                        value={nameFilter}
                        onChange={e => setNameFilter(e.target.value)}
                        className="px-3 py-1 border rounded w-full md:w-auto"
                    />
                </div>

                <select
                    value={activeFilter}
                    onChange={e => setActiveFilter(e.target.value)}
                    className="px-3 py-1 border rounded w-full md:w-auto"
                >
                    <option value="">All Active</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                </select>

                <button
                    onClick={() => setModal(true)}
                    className="ml-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full md:w-auto"
                >
                    <HiPlus className="mr-2" /> Add Feature
                </button>
            </div>

            {filterChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filterChips.map((c, i) => (
                        <span
                            key={i}
                            className="flex items-center bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-sm"
                        >
                            {c.label}
                            <HiX
                                className="ml-1 w-4 h-4 cursor-pointer"
                                onClick={c.clear}
                            />
                        </span>
                    ))}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"
                                onClick={() => onSort('name')}
                            >
                                Name
                                {sortBy === 'name' && (order === 'ASC'
                                    ? <HiChevronUp className="inline ml-1" />
                                    : <HiChevronDown className="inline ml-1" />)}
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"
                                onClick={() => onSort('active')}
                            >
                                Active
                                {sortBy === 'active' && (order === 'ASC'
                                    ? <HiChevronUp className="inline ml-1" />
                                    : <HiChevronDown className="inline ml-1" />)}
                            </th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={3} className="text-center py-4">Loading…</td></tr>
                        ) : features.length > 0 ? (
                            features.map(f => (
                                <tr key={f.id} className="border-t">
                                    <td className="px-4 py-2">{f.name}</td>
                                    <td className="px-4 py-2">{f.active ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => onDelete(f.id)}
                                            className="text-red-600 hover:underline inline-flex items-center"
                                        >
                                            <HiTrash className="mr-1" />Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={3} className="text-center py-4">No data found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 p-4">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">Add Feature</h3>
                        <form onSubmit={handleSubmit(onCreate)} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Feature name"
                                {...register('name')}
                                className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                            <div className="flex flex-col sm:flex-row justify-end sm:space-x-2 pt-4 space-y-2 sm:space-y-0">
                                <button
                                    type="button"
                                    onClick={() => { reset(); setModal(false); }}
                                    className="px-4 py-2 border rounded w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 w-full sm:w-auto"
                                >
                                    {isSubmitting ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}