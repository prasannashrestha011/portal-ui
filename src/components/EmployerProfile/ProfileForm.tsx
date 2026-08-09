'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EmployerProfile, UpsertEmployerProfileRequest } from '@/src/types/employerProfile';
import { Company } from '@/src/types/company';
import { useCompanyStore } from '@/src/context/useCompanyStore';
import { companyService } from '@/src/services/company';

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
    const isExistingOwner = Boolean(initialData?.company_id && initialData?.is_owner);

    const [designation, setDesignation] = useState(initialData?.designation || '');

    const [companyMode, setCompanyMode] = useState<'search' | 'create'>('search');

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Create new company state
    const [newCompanyName, setNewCompanyName] = useState('');
    const [newCompanyWebsite, setNewCompanyWebsite] = useState('');
    const [verificationFile, setVerificationFile] = useState<File | null>(null);

    const [creatingCompany, setCreatingCompany] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { searchCompanies, searchResults = [], searching, createCompany } = useCompanyStore();

    // Calculated ownership status
    const isOwner = isExistingOwner
        ? true
        : companyMode === 'create'
            ? true
            : initialData?.company_id && selectedCompany?.id === initialData.company_id
                ? (initialData.is_owner ?? false)
                : false;

    // Debounce search query
    useEffect(() => {
        if (companyMode !== 'search' || isExistingOwner) return;

        const trimmed = searchQuery.trim();
        if (trimmed.length < 2) {
            setIsDropdownOpen(false);
            return;
        }

        if (selectedCompany && selectedCompany.name === searchQuery) {
            return;
        }

        const timer = setTimeout(() => {
            searchCompanies(trimmed);
            setIsDropdownOpen(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, companyMode, selectedCompany, searchCompanies, isExistingOwner]);

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
            setSelectedCompany(null);
        }
    };

    const handleSelectCompany = (company: Company) => {
        setSelectedCompany(company);
        setSearchQuery(company.name);
        setIsDropdownOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setFormError('Verification document size must be under 5MB.');
                return;
            }
            setFormError(null);
            setVerificationFile(file);
        }
    };

    const handleRemoveFile = () => {
        setVerificationFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        let finalCompanyId: string | null = initialData?.company_id || null;

        try {
            if (isExistingOwner) {
                // Safeguard: Lock existing owner to their current company
                finalCompanyId = initialData?.company_id || null;
            } else if (companyMode === 'create') {
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

                if (verificationFile) {
                    await companyService.uploadVerificationDocument(createdCompany.id, verificationFile);
                }
            } else if (companyMode === 'search') {
                if (selectedCompany) {
                    finalCompanyId = selectedCompany.id;
                }
            }

            const payload: UpsertEmployerProfileRequest = {
                designation: designation.trim() || undefined,
                company_id: finalCompanyId,
                is_owner: isOwner,
            };

            await onSubmit(payload);
        } catch (err: any) {
            setFormError(err?.response?.data?.message || err?.message || 'Failed to complete profile update.');
        } finally {
            setCreatingCompany(false);
        }
    };

    const isLoading = isSubmitting || creatingCompany;
    const safeSearchResults = Array.isArray(searchResults) ? searchResults : [];

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8"
        >
            {/* Header */}
            <div className="border-b border-slate-100 pb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                    Employer Workspace
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                    {initialData ? 'Update Employer Profile' : 'Setup Employer Profile'}
                </h2>
            </div>

            {/* Error Alert */}
            {formError && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-200/80 bg-red-50/70 p-4 text-sm font-medium text-red-800">
                    <svg className="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>{formError}</span>
                </div>
            )}

            {/* Designation Input */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Job Designation / Title
                </label>
                <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Lead Technical Recruiter, HR Manager"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
            </div>

            {/* Company Section Container */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Company Information
                </label>

                {isExistingOwner ? (
                    /* Locked Company Card for Existing Owners */
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900">
                                Assigned Company Workspace
                            </span>
                            <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                                Locked (Company Owner)
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            As the Primary Owner of this company, you cannot switch or leave your workspace directly from profile settings. You must transfer primary ownership to another team member in <strong className="font-semibold text-slate-800">Company Settings</strong> first.
                        </p>
                    </div>
                ) : (
                    /* Dynamic Switcher for Non-Owners / New Profiles */
                    <>
                        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200/60 p-1 text-sm font-medium text-slate-600">
                            <button
                                type="button"
                                onClick={() => setCompanyMode('search')}
                                className={`rounded-lg py-2 text-center transition-all ${companyMode === 'search'
                                    ? 'bg-white font-semibold text-slate-950 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-950'
                                    }`}
                            >
                                Find Existing Company
                            </button>
                            <button
                                type="button"
                                onClick={() => setCompanyMode('create')}
                                className={`rounded-lg py-2 text-center transition-all ${companyMode === 'create'
                                    ? 'bg-white font-semibold text-slate-950 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-950'
                                    }`}
                            >
                                + Create New Company
                            </button>
                        </div>

                        {/* Search Existing Company */}
                        {companyMode === 'search' && (
                            <div className="relative" ref={dropdownRef}>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                    Search by Company Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => searchQuery.trim().length >= 2 && setIsDropdownOpen(true)}
                                        placeholder="Start typing company name (min 2 chars)..."
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                                    />
                                    {searching && (
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                            <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute z-20 left-0 right-0 mt-2 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/50">
                                        {searching ? (
                                            <div className="py-4 text-center text-xs font-medium text-slate-500">Searching...</div>
                                        ) : safeSearchResults.length > 0 ? (
                                            <ul className="space-y-0.5">
                                                {safeSearchResults.map((company) => (
                                                    <li
                                                        key={company.id}
                                                        onClick={() => handleSelectCompany(company)}
                                                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm cursor-pointer transition hover:bg-slate-100/70"
                                                    >
                                                        <span className="font-semibold text-slate-900">{company.name}</span>
                                                        {company.website && (
                                                            <span className="text-xs text-slate-500 font-normal">{company.website}</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="py-3 px-3 text-center text-xs text-slate-600">
                                                No companies found.{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNewCompanyName(searchQuery);
                                                        setCompanyMode('create');
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                                >
                                                    Create standard entry?
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedCompany && (
                                    <div className="mt-2.5 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-1.5 text-xs font-medium text-emerald-800">
                                        <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>Selected: <strong className="font-semibold">{selectedCompany.name}</strong></span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Create New Company */}
                        {companyMode === 'create' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                        Company Name <span className="text-blue-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newCompanyName}
                                        onChange={(e) => setNewCompanyName(e.target.value)}
                                        placeholder="e.g. Acme Corporation"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                        Company Website <span className="text-slate-400 font-normal">(Optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={newCompanyWebsite}
                                        onChange={(e) => setNewCompanyWebsite(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                        Verification Document <span className="text-slate-400 font-normal">(PAN / Registration Certificate)</span>
                                    </label>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    {!verificationFile ? (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-5 text-center transition hover:border-blue-500 hover:bg-blue-50/30"
                                        >
                                            <svg className="h-8 w-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                            </svg>
                                            <p className="text-xs font-semibold text-blue-600">
                                                Click to upload registration document
                                            </p>
                                            <p className="mt-1 text-[11px] text-slate-400">
                                                PDF, PNG, or JPG up to 5MB
                                            </p>
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/50 p-3.5">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                </div>
                                                <div className="truncate">
                                                    <p className="truncate text-xs font-semibold text-slate-900">
                                                        {verificationFile.name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500">
                                                        {formatFileSize(verificationFile.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="ml-2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
                                                title="Remove file"
                                            >
                                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Read-only Ownership Role Card */}
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="mt-0.5 rounded-lg bg-blue-100 p-1.5 text-blue-700">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                            {isOwner ? 'Workspace Owner / Admin' : 'Team Recruiter'}
                        </span>
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${isOwner ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'}`}>
                            {isOwner ? 'Owner Permissions' : 'Member Permissions'}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                        {companyMode === 'create'
                            ? 'Creating a new company automatically assigns you as the Primary Owner.'
                            : isOwner
                                ? 'You are the owner of this workspace. Ownership transfers must be managed in Company Settings.'
                                : 'Joining an existing company assigns you as a Recruiter. An existing Owner can grant you Admin rights.'}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
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