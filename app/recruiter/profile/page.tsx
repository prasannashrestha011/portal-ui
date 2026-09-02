"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { EmployerProfileCard } from "@/src/components/RecruiterProfile/ProfileCard";
import { EmployerProfileForm } from "@/src/components/RecruiterProfile/ProfileForm";
import { useRecruiterProfileStore } from "@/src/context/useRecruiterProfile";
import { UpsertRecruiterProfileRequest } from "@/src/types/recruiterProfile";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";


export default function RecruiterProfilePage() {
  const { profile, loading, error, saveProfile, updateLogo } = useRecruiterProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);


  const handleUpsert = async (payload: UpsertRecruiterProfileRequest) => {
    setSaving(true);
    try {
      const { organization_logo, ...profileData } = payload
      await saveProfile(profileData);
      setIsEditing(false);
      if (organization_logo) {
        await updateLogo(organization_logo);
      }
    } catch {
      // Store captures error message in `error` state
    } finally {
      setSaving(false);
    }
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.user?.email) score += 10;
    if (profile.designation) score += 10;
    if (profile.organization_logo) score += 10;
    if (profile.organization_name) score += 15;
    if (profile.organization_website) score += 10;
    if (profile.organization_address) score += 10;
    if (profile.organization_about) score += 10;
    if (profile.verification_status === "approved") score += 25;
    return score;
  };
  const completionScore = calculateCompletion();

  return (
    <div className="relative min-h-screen w-full bg-background px-4 py-8 text-text-primary sm:px-6 sm:py-10">
      {/* Full Page Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[32px_32px] opacity-40"
      />

      <div className="relative z-10 mx-auto max-w-6xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 border-b border-border/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="workspace-page-title text-text-primary">
              {isEditing ? "Edit Employer Profile" : "Employer Dashboard"}
            </h1>
            <p className="workspace-body text-text-muted">
              Manage your personal details, workspace access, and recruitment configuration
            </p>
          </div>

          {!loading && profile && !isEditing && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 border-border-strong bg-surface px-3 py-1 text-xs font-semibold text-text-secondary shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-success" />
                Active Workspace
              </Badge>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-error/25 bg-error-subtle p-4 text-error-active shadow-2xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-error" />
              <div>
                <p className="text-sm font-semibold">Something went wrong</p>
                <p className="text-xs text-error">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Main Layout Grid */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main Content Column (2 Columns wide) */}
          <div className="space-y-6 lg:col-span-2">
            {loading ? (
              <Card className="overflow-hidden border border-border bg-surface shadow-2xs">
                <Skeleton className="h-32 w-full rounded-none bg-surface-muted sm:h-40" />
                <CardContent className="relative px-6 pb-6 pt-0 sm:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                    <div className="-mt-16 sm:-mt-20">
                      <Skeleton className="h-28 w-28 rounded-full border-4 border-surface bg-surface-muted sm:h-36 sm:w-36" />
                    </div>
                    <Skeleton className="mt-4 h-9 w-28 rounded-full bg-surface-muted sm:mt-0" />
                  </div>
                  <div className="mt-6 space-y-4">
                    <Skeleton className="h-7 w-52 bg-surface-muted" />
                    <Skeleton className="h-4 w-40 bg-surface-muted" />
                  </div>
                </CardContent>
              </Card>
            ) : isEditing || !profile ? (
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-2xs sm:p-8">
                <EmployerProfileForm
                  initialData={profile}
                  onSubmit={handleUpsert}
                  onCancel={profile ? () => setIsEditing(false) : undefined}
                  isSubmitting={saving}
                />
              </div>
            ) : (
              <EmployerProfileCard
                profile={profile}
                onEdit={() => setIsEditing(true)}
              />
            )}

          </div>

          {/* Sidebar Column (1 Column wide) */}
          <div className="space-y-6">

            {/* Profile Completion Card */}
            <Card className="border border-border bg-surface shadow-2xs">
              <CardHeader className="pb-3">
                <CardTitle className="workspace-section-title text-text-primary">
                  Profile Strength
                </CardTitle>
                <CardDescription className="workspace-meta text-text-muted">
                  Complete your profile to build trust with candidates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                    <span>Progress</span>
                    <span className="text-primary">{completionScore}%</span>
                  </div>
                  <Progress value={completionScore} className="h-2 bg-surface-muted" />
                </div>

                <ul className="space-y-2 text-xs">
                  <li className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.user?.email ? "text-success" : "text-text-disabled"}`} />
                    <span>Work email added</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.designation ? "text-success" : "text-text-disabled"}`} />
                    <span>Designation defined</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.organization_name ? "text-success" : "text-text-disabled"}`} />
                    <span>Connected to company</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.organization_website ? "text-success" : "text-text-disabled"}`} />
                    <span>Company website linked</span>
                  </li>

                  <li className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.organization_logo ? "text-success" : "text-text-disabled"}`} />
                    <span>Company Logo </span>
                  </li>

                  <li className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.organization_address ? "text-success" : "text-text-disabled"}`} />
                    <span>Company Address </span>
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.industry ? "text-success" : "text-text-disabled"}`} />
                    <span>Industry </span>
                  </li>

                  <li className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.organization_about ? "text-success" : "text-text-disabled"}`} />
                    <span>Company Description </span>
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.verification_status === "approved" ? "text-success" : "text-text-disabled"}`} />
                    <span>Company verified</span>
                  </li>
                </ul>

                {completionScore < 100 && !isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="workspace-action w-full border-primary/30 bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    Complete missing fields
                  </Button>
                )}
              </CardContent>
            </Card>


            {/* Support / Guidelines Box */}
            <div className="workspace-meta rounded-xl border border-primary/20 bg-primary-subtle/60 p-4 text-primary-active">
              <div className="flex items-center gap-2 font-bold text-primary">
                <HelpCircle className="h-4 w-4" />
                Employer Guidelines
              </div>
              <p className="mt-1.5 text-text-secondary leading-relaxed">
                Ensure your designation and company details match official records. Unverified workspaces may have limited candidate outreach capabilities.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
