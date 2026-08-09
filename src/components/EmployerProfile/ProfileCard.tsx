"use client";

import React from "react";
import {
  Building2,
  ExternalLink,
  Pencil,
  Mail,
  Briefcase,
  ShieldCheck,
  Crown,
  Globe
} from "lucide-react";
import { EmployerProfile } from "@/src/types/employerProfile";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  profile: EmployerProfile;
  onEdit: () => void;
}

export const EmployerProfileCard: React.FC<Props> = ({ profile, onEdit }) => {
  const email = profile.user?.email || "";
  const displayName = email ? email.split("@")[0] : "Employer Profile";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Card className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Bright LinkedIn Blue Cover Banner */}
      <div className="h-32 w-full bg-[#0a66c2] sm:h-40" />

      <CardContent className="relative px-6 pb-6 pt-0 sm:px-8">
        {/* Header Row: Avatar & Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-16 flex items-end sm:-mt-20">
            <Avatar className="h-28 w-28 rounded-full border-4 border-white bg-white shadow-md sm:h-36 sm:w-36">
              <AvatarFallback className="bg-blue-50 text-3xl font-bold text-[#0a66c2] sm:text-4xl">
                {initial}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-4 flex items-center sm:mt-0">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-[#0a66c2] bg-white font-semibold text-[#0a66c2] hover:bg-blue-50 hover:text-[#004182]"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </Button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {/* User Details */}
          <div className="space-y-3 md:col-span-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {displayName}
                </h1>
                {profile.is_owner && (
                  <Badge
                    variant="secondary"
                    className="gap-1 border border-amber-200 bg-amber-50 text-xs font-semibold text-amber-800"
                  >
                    <Crown className="h-3 w-3 text-amber-600" />
                    Owner
                  </Badge>
                )}
              </div>

              <p className="mt-1 flex items-center gap-1.5 text-base font-medium text-slate-600">
                <Briefcase className="h-4 w-4 shrink-0 text-slate-400" />
                {profile.designation || "No designation specified"}
              </p>

              {email && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                  {email}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline" className="border-slate-300 text-xs font-medium text-slate-600">
                Employer Account
              </Badge>
              <Badge
                variant="secondary"
                className={
                  profile.is_owner
                    ? "border border-blue-100 bg-blue-50 text-[#0a66c2]"
                    : "border border-slate-200 bg-slate-100 text-slate-700"
                }
              >
                <ShieldCheck className="mr-1 h-3 w-3" />
                {profile.is_owner ? "Company Owner" : "Team Member"}
              </Badge>
            </div>
          </div>

          {/* Company Card Block */}
          {profile.company ? (
            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0a66c2] shadow-xs">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Associated Company
                  </p>
                  <h2 className="truncate text-sm font-bold text-slate-900">
                    {profile.company.name}
                  </h2>
                  <p className="text-xs text-slate-500">Employer Workspace</p>
                </div>
              </div>

              {profile.company.website && (
                <div className="mt-3 border-t border-slate-200 pt-3">
                  <a
                    href={profile.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a66c2] hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Visit website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
              <Building2 className="h-6 w-6 text-slate-400" />
              <p className="mt-1 text-xs font-medium text-slate-900">No Company Linked</p>
              <p className="text-xs text-slate-500">Edit profile to connect a workspace</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployerProfileCard;