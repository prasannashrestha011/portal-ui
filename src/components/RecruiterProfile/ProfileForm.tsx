'use client';

import React, { useState, useRef } from 'react';
import { EmployerProfile, UpsertEmployerProfileRequest } from '@/src/types/recruiterProfile';

interface Props {
    initialData?: EmployerProfile | null;
    onSubmit: (payload: UpsertEmployerProfileRequest) => Promise<void>;
    onCancel?: () => void;
    isSubmitting: boolean;
}

const ORG_SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

export const EmployerProfileForm: React.FC<Props> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
}) => {
    const [designation, setDesignation] = useState(initialData?.designation || '');
    const [organizationName, setOrganizationName] = useState(initialData?.organization_name || '');
    const [organizationWebsite, setOrganizationWebsite] = useState(initialData?.organization_website || '');
    const [organizationAddress, setOrganizationAddress] = useState(initialData?.organization_address || '');
    const [industry, setIndustry] = useState(initialData?.industry || '');
    const [organizationSize, setOrganizationSize] = useState(initialData?.organization_size || '');
    const [organizationAbout, setOrganizationAbout] = useState(initialData?.organization_about || '');

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.organization_logo || null);

    const [formError, setFormError] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setFormError('Logo size must be under 5MB.');
            return;
        }

        setFormError(null);
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
        if (logoInputRef.current) logoInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!organizationName.trim()) {
            setFormError('Please enter an organization name.');
            return;
        }

        const payload: UpsertEmployerProfileRequest = {
            designation: designation.trim() || undefined,
            organization_name: organizationName.trim(),
            organization_website: organizationWebsite.trim() || undefined,
            organization_address: organizationAddress.trim() || undefined,
            industry: industry.trim() || undefined,
            organization_size: organizationSize || undefined,
            organization_about: organizationAbout.trim() || undefined,
            organization_logo: logoFile ?? undefined,
        };

        try {
            await onSubmit(payload);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setFormError(err?.response?.data?.message || err?.message || 'Failed to save profile.');
        }
    };

    const inputClass =
        'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted shadow-sm transition duration-150 ease-in-out focus:border-primary focus:outline-none focus:ring-4 focus:ring-focus-ring/20';
    const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5';

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-border/80 bg-surface p-6 shadow-xl shadow-text-primary/5 sm:p-8"
        >
            {/* Header */}
            <div className="border-b border-border pb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-hover">
                    Employer Workspace
                </p>
                <h2 className="workspace-page-title mt-1 text-text-primary">
                    {initialData ? 'Update Employer Profile' : 'Setup Employer Profile'}
                </h2>
            </div>

            {/* Error Alert */}
            {formError && (
                <div className="flex items-center gap-3 rounded-2xl border border-error/25 bg-error-subtle/70 p-4 text-sm font-medium text-error-active">
                    <svg className="h-5 w-5 shrink-0 text-error" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>{formError}</span>
                </div>
            )}

            {/* Personal role */}
            <div>
                <label className={labelClass}>Job Designation / Title</label>
                <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Lead Technical Recruiter, HR Manager"
                    className={inputClass}
                />
            </div>

            {/* Organization Section */}
            <div className="rounded-2xl border border-border/80 bg-surface-hover/50 p-5 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Organization Information
                </label>

                {/* Logo */}
                <div>
                    <label className={labelClass}>Organization Logo</label>
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg"
                        onChange={handleLogoChange}
                        className="hidden"
                    />
                    {!logoPreview ? (
                        <button
                            type="button"
                            onClick={() => logoInputRef.current?.click()}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-surface p-4 text-center transition hover:border-primary hover:bg-primary-subtle/70"
                        >
                            <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                            </svg>
                            <span className="text-xs font-semibold text-primary">Upload logo (PNG, JPG, SVG up to 5MB)</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                            <img src={logoPreview} alt="Organization logo" className="h-12 w-12 shrink-0 rounded-lg border border-border object-contain" />
                            <span className="flex-1 truncate text-xs text-text-muted">{logoFile?.name || 'Current logo'}</span>
                            <button
                                type="button"
                                onClick={handleRemoveLogo}
                                className="rounded-lg p-1.5 text-text-muted transition hover:bg-surface-muted hover:text-text-secondary"
                                title="Remove logo"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Name */}
                <div>
                    <label className={labelClass}>
                        Organization Name <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="e.g. Acme Corporation"
                        className={inputClass}
                    />
                </div>

                {/* Website + Address */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className={labelClass}>Website</label>
                        <input
                            type="url"
                            value={organizationWebsite}
                            onChange={(e) => setOrganizationWebsite(e.target.value)}
                            placeholder="https://example.com"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Address</label>
                        <input
                            type="text"
                            value={organizationAddress}
                            onChange={(e) => setOrganizationAddress(e.target.value)}
                            placeholder="City, Country"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Industry + Size */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className={labelClass}>Industry</label>
                        <input
                            type="text"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            placeholder="e.g. Software, Healthcare"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Organization Size</label>
                        <select
                            value={organizationSize}
                            onChange={(e) => setOrganizationSize(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Select range</option>
                            {ORG_SIZE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt} employees</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* About */}
                <div>
                    <label className={labelClass}>About the Organization</label>
                    <textarea
                        value={organizationAbout}
                        onChange={(e) => setOrganizationAbout(e.target.value)}
                        placeholder="Brief description of what the organization does..."
                        rows={4}
                        className={`${inputClass} resize-none`}
                    />
                </div>
            </div>


            {initialData?.verification_status === 'draft' && (
                <div className="rounded-2xl border border-warning/30 bg-warning-subtle/70 p-4 text-sm font-medium text-warning-active">
                    Next step: Submit your profile for verification. Once submitted, it will be reviewed by our team.
                </div>
            )}
            {initialData?.verification_status === 'pending' && (
                <div className="rounded-2xl border border-warning/30 bg-warning-subtle/70 p-4 text-sm font-medium text-warning-active">
                    Your profile is currently under review. You will be notified once it has been verified.
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-sm transition hover:bg-surface-hover hover:text-text-primary disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting && (
                        <svg className="animate-spin h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    )}
                    <span>{isSubmitting ? 'Saving...' : 'Save Profile'}</span>
                </button>
            </div>
        </form>
    );
};
