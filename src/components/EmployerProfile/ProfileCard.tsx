"use client"
import { EmployerProfile } from '@/src/types/employerProfile';
import React from 'react';

interface Props {
    profile: EmployerProfile;
    onEdit: () => void;
}

export const EmployerProfileCard: React.FC<Props> = ({ profile, onEdit }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {profile.user?.email ? profile.user.email.split('@')[0] : 'Employer Profile'}
                    </h2>
                    <p className="text-sm text-gray-500">{profile.user?.email}</p>
                </div>
                <button
                    onClick={onEdit}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                >
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Designation
                    </span>
                    <p className="mt-1 text-base font-medium text-gray-800">
                        {profile.designation || 'Not set'}
                    </p>
                </div>

                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Company Role
                    </span>
                    <p className="mt-1">
                        {profile.is_owner ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Company Owner
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Team Member
                            </span>
                        )}
                    </p>
                </div>

                <div className="md:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Associated Company
                    </span>
                    {profile.company ? (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">{profile.company.name}</p>
                                {profile.company.website && (
                                    <a
                                        href={profile.company.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-indigo-600 hover:underline"
                                    >
                                        {profile.company.website}
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="mt-1 text-sm text-gray-500 italic">
                            Not linked to any company yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};