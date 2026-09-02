"use client";

import React from "react";
import {
  Building2,
  ExternalLink,
  Pencil,
  Mail,
  Briefcase,
  Globe,
  MapPin,
  Users,
  Layers,
} from "lucide-react";
import { EmployerProfile } from "@/src/types/recruiterProfile";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Props {
  profile: EmployerProfile;
  onEdit: () => void;
}

export const EmployerProfileCard: React.FC<Props> = ({ profile, onEdit }) => {
  const email = profile.user?.email || "";
  const displayName = profile.user?.full_name || "Employer Profile";
  const initial = displayName.charAt(0).toUpperCase();

  const meta = [
    { icon: Layers, label: profile.industry },
    { icon: Users, label: profile.organization_size },
    { icon: MapPin, label: profile.organization_address },
  ].filter((item) => item.label);

  return (
    <Card className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
      {/* Cover banner */}
      <div className="h-32 w-full bg-primary sm:h-40" />

      <CardContent className="relative px-6 pb-6 pt-0 sm:px-8">
        {/* Header row: avatar + edit action */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-16 flex items-end sm:-mt-20">
            <Avatar className="h-28 w-28 rounded-full border-4 border-surface bg-surface shadow-md sm:h-36 sm:w-36">
              <AvatarFallback className="bg-primary-subtle text-3xl font-bold text-primary sm:text-4xl">
                {initial}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-4 flex items-center sm:mt-0">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-primary bg-surface font-semibold text-primary hover:bg-primary-subtle hover:text-primary-hover"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </Button>
          </div>
        </div>

        {/* User details */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="workspace-page-title text-text-primary">
                {displayName}
              </h1>
            </div>

            <p className="mt-1 flex items-center gap-1.5 text-base font-medium text-text-secondary">
              <Briefcase className="h-4 w-4 shrink-0 text-text-muted" />
              {profile.designation || "No designation specified"}
            </p>

            {email && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
                <Mail className="h-4 w-4 shrink-0 text-text-muted" />
                {email}
              </p>
            )}
          </div>

        </div>


        {/* Organization block */}
        <div className="mt-6 rounded-xl border border-border bg-surface-hover p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 shrink-0 rounded-lg border border-border bg-surface">
              {profile.organization_logo && (
                <AvatarImage
                  src={profile.organization_logo}
                  alt={profile.organization_name}
                  className="object-contain"
                />
              )}
              <AvatarFallback className="rounded-lg bg-surface text-primary">
                <Building2 className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Organization
              </p>
              <h2 className="workspace-section-title truncate text-text-primary">
                {profile.organization_name}
              </h2>

              {meta.length > 0 && (
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                  {meta.map(({ icon: Icon, label }, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <Icon className="h-3.5 w-3.5 text-text-muted" />
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {profile.organization_website && (
              <a
                href={profile.organization_website}
                target="_blank"
                rel="noreferrer"
                className="hidden shrink-0 items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-subtle sm:flex"
              >
                <Globe className="h-3.5 w-3.5" />
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {profile.organization_about && (
            <p className="workspace-body mt-4 border-t border-border pt-3 text-text-secondary">
              {profile.organization_about}
            </p>
          )}

          {profile.organization_website && (

            <a
              href={profile.organization_website}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline sm:hidden"
            >
              <Globe className="h-3.5 w-3.5" />
              Visit website
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </CardContent >
    </Card >
  );
};

export default EmployerProfileCard;
