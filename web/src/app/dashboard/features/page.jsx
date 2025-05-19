'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    HiPlus, HiTrash, HiSearch,
    HiChevronUp, HiChevronDown,
    HiX
} from 'react-icons/hi';
import { Toaster } from 'react-hot-toast';
import { apiRequest } from '@/services/apiRequest';
import { notifySuccess, notifyError } from '@/utils/notifications';

// 1) Validation schema for the create modal
const createSchema = yup.object({
    name: yup.string().required('Nama fitur wajib diisi'),
});

// 2) Simple debounce hook
function useDebounce(value, delay = 500) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

export default function FeaturesPage() {
    // filter & sort state
    const [nameFilter, setNameFilter] = useState('');
    const debouncedName = useDebounce(nameFilter, 500);
    const [activeFilter, setActiveFilter] = useState('');        // ''|'1'|'0'
    const [sortBy, setSortBy] = useState('name');
    const [order, setOrder] = useState('ASC');      // 'ASC'|'DESC'

    // data + loading
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(false);

    // modal + form
    const [modal, setModal] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({ resolver: yupResolver(createSchema) });

    // 3) The fetch function (called inside effects, never passed directly)
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
                }
            });
            setFeatures(data);
        } catch (err) {
            notifyError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // 4) On mount & whenever our inputs change, call fetchFeatures()
    useEffect(() => {
        // define async inner, then call it
        async function load() {
            await fetchFeatures();
        }
        load();
    }, [debouncedName, activeFilter, sortBy, order]);

    // 5) Create handler
    const onCreate = async (vals) => {
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

    // 6) Delete handler
    const onDelete = async (id) => {
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

    // 7) Sort toggler
    const onSort = (field) => {
        if (sortBy === field) {
            setOrder(o => (o === 'ASC' ? 'DESC' : 'ASC'));
        } else {
            setSortBy(field);
            setOrder('ASC');
        }
    };

    // 8) Build “chips” for each active filter
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
        <div className="p-8 bg-white rounded shadow space-y-6">
            <Toaster />

            {/* Filters & Create Button */}
            <div className="flex flex-wrap items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <HiSearch className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Filter nama..."
                        value={nameFilter}
                        onChange={e => setNameFilter(e.target.value)}
                        className="px-3 py-1 border rounded"
                    />
                </div>

                <select
                    value={activeFilter}
                    onChange={e => setActiveFilter(e.target.value)}
                    className="px-3 py-1 border rounded"
                >
                    <option value="">All Active</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                </select>

                <button
                    onClick={() => setModal(true)}
                    className="ml-auto flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    <HiPlus className="mr-2" /> Add Feature
                </button>
            </div>

            {/* Active Filter Chips */}
            {filterChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
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

            {/* Features Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"
                                onClick={() => onSort('name')}
                            >
                                Name
                                {sortBy === 'name' && (
                                    order === 'ASC'
                                        ? <HiChevronUp className="inline-block ml-1" />
                                        : <HiChevronDown className="inline-block ml-1" />
                                )}
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"
                                onClick={() => onSort('active')}
                            >
                                Active
                                {sortBy === 'active' && (
                                    order === 'ASC'
                                        ? <HiChevronUp className="inline-block ml-1" />
                                        : <HiChevronDown className="inline-block ml-1" />
                                )}
                            </th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? <tr><td colSpan={3} className="text-center py-4">Loading…</td></tr>
                            : features.length > 0
                                ? features.map(f => (
                                    <tr key={f.id} className="border-t">
                                        <td className="px-4 py-2">{f.name}</td>
                                        <td className="px-4 py-2">{f.active ? 'Yes' : 'No'}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => onDelete(f.id)}
                                                className="text-red-600 hover:underline flex items-center justify-center"
                                            >
                                                <HiTrash className="mr-1" />Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                : <tr><td colSpan={3} className="text-center py-4">No data found</td></tr>
                        }
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
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
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { reset(); setModal(false); }}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
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