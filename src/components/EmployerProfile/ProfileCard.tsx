"use client";

import { EmployerProfile } from "@/src/types/employerProfile";
import React from "react";

interface Props {
  profile: EmployerProfile;
  onEdit: () => void;
}

export const EmployerProfileCard: React.FC<Props> = ({ profile, onEdit }) => {
  const displayName = profile.user?.email?.split("@")[0] || "Employer Profile";

  return (
    <section className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="h-32 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700" />
      <div className="px-6 pb-7 sm:px-9">
        <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex size-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-3xl font-bold text-blue-700 shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="pb-1">
              <p className="text-sm font-medium text-blue-700">Employer account</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">{displayName}</h1>
              <p className="text-sm text-slate-500">{profile.user?.email}</p>
            </div>
          </div>
          <button onClick={onEdit} className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
            Edit profile
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InfoBlock label="Designation" value={profile.designation || "Not set"} />
          <InfoBlock label="Access level" value={profile.is_owner ? "Company owner" : "Team member"} accent={profile.is_owner} />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Associated company</p>
          {profile.company ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{profile.company.name}</h2>
                <p className="text-sm text-slate-500">Your employer workspace</p>
              </div>
              {profile.company.website && (
                <a href={profile.company.website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline">
                  Visit website
                </a>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Not linked to a company yet. Edit your profile to connect one.</p>
          )}
        </div>
      </div>
    </section>
  );
};

function InfoBlock({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={accent ? "mt-2 text-base font-semibold text-amber-700" : "mt-2 text-base font-semibold text-slate-950"}>{value}</p>
    </div>
  );
}

export default EmployerProfileCard;
