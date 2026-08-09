"use client"
import { EmployerProfileCard } from '@/src/components/EmployerProfile/ProfileCard';
import { EmployerProfileForm } from '@/src/components/EmployerProfile/ProfileForm';
import { useEmployerProfileStore } from '@/src/context/useEmployerProfile';
import { UpsertEmployerProfileRequest } from '@/src/types/employerProfile';
import React, { useEffect, useState } from 'react';

export default function EmployerProfilePage() {
    const { profile, loading, error, fetchProfile, saveProfile } = useEmployerProfileStore();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleUpsert = async (payload: UpsertEmployerProfileRequest) => {
        setSaving(true);
        try {
            await saveProfile(payload);
            setIsEditing(false);
        } catch {
            // Store captures error message in `error` state
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-75">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <main className="min-h-full bg-slate-100 px-4 py-8 sm:py-12">
            {error && (
                <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {isEditing || !profile ? (
                <EmployerProfileForm
                    initialData={profile}
                    onSubmit={handleUpsert}
                    onCancel={profile ? () => setIsEditing(false) : undefined}
                    isSubmitting={saving}
                />
            ) : (
                <EmployerProfileCard
                    profile={profile}
                    onEdit={() => setIsEditing(true)}
                />
            )}
        </main>
    );
}
