'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EmployerProfile, UpsertEmployerProfileRequest } from '@/src/types/employerProfile';
import { Company } from '@/src/types/company';
import { useCompanyStore } from '@/src/context/useCompanyStore';

interface Props {
    initialData?: EmployerProfile | null;
    onSubmit: (payload: UpsertEmployerProfileRequest) => Promise<void>;
    onCancel?: () => void;
    isSubmitting: boolean;
}

export const EmployerProfileForm: React.FC<Props> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
}) => {
    const [designation, setDesignation] = useState(initialData?.designation || '');
    const [isOwner, setIsOwner] = useState(initialData?.is_owner || false);

    const [companyMode, setCompanyMode] = useState<'search' | 'create'>('search');

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Create new company state
    const [newCompanyName, setNewCompanyName] = useState('');
    const [newCompanyWebsite, setNewCompanyWebsite] = useState('');

    const [creatingCompany, setCreatingCompany] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Extract `searching` from Zustand store
    const { searchCompanies, searchResults = [], searching, createCompany } = useCompanyStore();

    // Debounce search query to prevent race conditions and excessive API calls
    useEffect(() => {
        if (companyMode !== 'search') return;

        const trimmed = searchQuery.trim();
        if (trimmed.length < 2) {
            setIsDropdownOpen(false);
            return;
        }

        // Don't search if the query matches the already selected company name
        if (selectedCompany && selectedCompany.name === searchQuery) {
            return;
        }

        const timer = setTimeout(() => {
            searchCompanies(trimmed);
            setIsDropdownOpen(true);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery, companyMode, selectedCompany, searchCompanies]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (selectedCompany) {
            setSelectedCompany(null); // Clear selection if user resumes typing
        }
    };

    const handleSelectCompany = (company: Company) => {
        setSelectedCompany(company);
        setSearchQuery(company.name);
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        let finalCompanyId: string | null = initialData?.company_id || null;
        let finalIsOwner = isOwner;

        try {
            if (companyMode === 'create') {
                if (!newCompanyName.trim()) {
                    setFormError('Please enter a company name.');
                    return;
                }

                setCreatingCompany(true);
                const createdCompany = await createCompany({
                    name: newCompanyName.trim(),
                    website: newCompanyWebsite.trim() || undefined,
                });

                finalCompanyId = createdCompany.id;
                finalIsOwner = true;
            } else if (companyMode === 'search') {
                if (selectedCompany) {
                    finalCompanyId = selectedCompany.id;
                }
            }

            const payload: UpsertEmployerProfileRequest = {
                designation: designation.trim() || undefined,
                company_id: finalCompanyId,
                is_owner: finalIsOwner,
            };

            await onSubmit(payload);
        } catch (err: any) {
            setFormError(err?.message || 'Failed to complete profile update.');
        } finally {
            setCreatingCompany(false);
        }
    };

    const isLoading = isSubmitting || creatingCompany;
    const safeSearchResults = Array.isArray(searchResults) ? searchResults : [];

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-2xl mx-auto space-y-6"
        >
            <h2 className="text-xl font-bold text-gray-900">
                {initialData ? 'Update Employer Profile' : 'Setup Employer Profile'}
            </h2>

            {formError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                    {formError}
                </div>
            )}

            {/* Designation Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Designation / Title
                </label>
                <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Lead Technical Recruiter, HR Manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
            </div>

            {/* Company Section */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-4">
                <label className="block text-sm font-semibold text-gray-800">
                    Company Information
                </label>

                {/* Mode Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setCompanyMode('search')}
                        className={`pb-2 px-3 text-sm font-medium border-b-2 transition-colors ${companyMode === 'search'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Find Existing Company
                    </button>
                    <button
                        type="button"
                        onClick={() => setCompanyMode('create')}
                        className={`pb-2 px-3 text-sm font-medium border-b-2 transition-colors ${companyMode === 'create'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        + Create New Company
                    </button>
                </div>

                {/* Tab 1: Search Existing Company */}
                {companyMode === 'search' && (
                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Search by Company Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => searchQuery.trim().length >= 2 && setIsDropdownOpen(true)}
                                placeholder="Start typing company name (min 2 chars)..."
                                className="w-full px-3 py-2 pr-8 border border-gray-300 bg-white text-black rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition"
                            />
                            {searching && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <svg className="animate-spin h-4 w-4 text-indigo-600" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Autocomplete Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                                {searching ? (
                                    <div className="p-3 text-sm text-gray-500 text-center">Searching...</div>
                                ) : safeSearchResults.length > 0 ? (
                                    <ul className="divide-y divide-gray-100">
                                        {safeSearchResults.map((company) => (
                                            <li
                                                key={company.id}
                                                onClick={() => handleSelectCompany(company)}
                                                className="p-3 hover:bg-indigo-50 cursor-pointer transition flex justify-between items-center"
                                            >
                                                <span className="text-sm font-medium text-gray-800">{company.name}</span>
                                                {company.website && (
                                                    <span className="text-xs text-gray-400">{company.website}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-3 text-sm text-gray-500 text-center">
                                        No companies found.{' '}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewCompanyName(searchQuery);
                                                setCompanyMode('create');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="text-indigo-600 font-medium hover:underline"
                                        >
                                            Create standard entry?
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedCompany && (
                            <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                                ✓ Selected: {selectedCompany.name}
                            </p>
                        )}
                    </div>
                )}

                {/* Tab 2: Create New Company */}
                {companyMode === 'create' && (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                value={newCompanyName}
                                onChange={(e) => setNewCompanyName(e.target.value)}
                                placeholder="e.g. Acme Corporation"
                                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Company Website <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="url"
                                value={newCompanyWebsite}
                                onChange={(e) => setNewCompanyWebsite(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Primary Owner Checkbox */}
            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    id="is_owner"
                    checked={companyMode === 'create' ? true : isOwner}
                    disabled={companyMode === 'create'}
                    onChange={(e) => setIsOwner(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-60"
                />
                <label htmlFor="is_owner" className="text-sm font-medium text-gray-700 select-none">
                    Is Company Admin / Primary Owner
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center space-x-2"
                >
                    {isLoading && (
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    )}
                    <span>{isLoading ? 'Saving...' : 'Save Profile'}</span>
                </button>
            </div>
        </form>
    );
};