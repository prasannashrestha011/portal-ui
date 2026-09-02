"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";

import { employerService } from "@/src/services/recruiterProfile";
import { OrganizationVerification } from "@/src/types/organizationVerification";

const VerificationStatus = () => {
  const [verification, setVerification] =
    useState<OrganizationVerification | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await employerService.getMyVerification();
        console.log("Verification Status:", data);
        setVerification(data.verification);
        setDocumentUrl(data.document_url);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load verification status."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, []);

  if (loading) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />

          <p className="workspace-body mt-4 text-muted-foreground">
            Loading verification status...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!verification) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground" />

          <h2 className="workspace-section-title mt-4">
            No verification found
          </h2>

          <p className="workspace-body mt-2 text-muted-foreground">
            You have not submitted an organization verification
            request yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (verification.status === "pending") {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-warning-subtle dark:bg-warning-subtle/60">
            <Clock3 className="h-7 w-7 text-warning-hover" />
          </div>

          <CardTitle className="workspace-section-title mt-4">
            Verification under review
          </CardTitle>

          <CardDescription className="workspace-body">
            Your organization verification request has been submitted
            successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Verification details */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Organization email
                </p>
                <p className="mt-1 text-sm font-medium">
                  {verification.organization_email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Document type
                </p>
                <p className="mt-1 text-sm font-medium">
                  {verification.document_type || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Submitted
                </p>
                <p className="mt-1 text-sm font-medium">
                  {verification.submitted_at
                    ? new Date(
                      verification.submitted_at
                    ).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>
                <p className="mt-1 text-sm font-medium capitalize">
                  {verification.status}
                </p>
              </div>
            </div>
          </div>

          {/* Document preview */}
          {documentUrl && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">
                  Submitted document
                </p>
                <p className="text-xs text-muted-foreground">
                  The document submitted for verification
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border bg-muted/20">
                <img
                  src={documentUrl}
                  alt="Organization verification document"
                  className="mx-auto max-h-[500px] w-full object-contain"
                />
              </div>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Our team is reviewing your submitted information. You will be
            notified once the review is complete.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (verification.status === "approved") {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-subtle dark:bg-success-subtle/60">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>

          <CardTitle className="workspace-section-title mt-4">
            Organization verified
          </CardTitle>

          <CardDescription className="workspace-body">
            Your organization has been successfully verified.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  Organization email
                </p>
                <p className="mt-1 text-sm font-medium">
                  {verification.organization_email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Document type
                </p>
                <p className="mt-1 text-sm font-medium">
                  {verification.document_type || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Verified on
                </p>
                <p className="mt-1 text-sm font-medium">
                  {verification.verified_at
                    ? new Date(
                      verification.verified_at
                    ).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>
                <p className="mt-1 text-sm font-medium text-success">
                  Verified
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verification.status === "rejected") {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-subtle dark:bg-error-subtle/60">
            <XCircle className="h-7 w-7 text-error" />
          </div>

          <CardTitle className="workspace-section-title mt-4">
            Verification rejected
          </CardTitle>

          <CardDescription className="workspace-body">
            Your organization verification could not be approved.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {verification.rejection_reason && (
            <div className="rounded-lg border border-error/25 bg-error-subtle p-4 dark:border-error/30 dark:bg-error-subtle/50">
              <p className="text-sm font-medium text-error dark:text-error">
                Rejection reason
              </p>

              <p className="mt-1 text-sm text-error dark:text-error">
                {verification.rejection_reason}
              </p>
            </div>
          )}

          {verification.review_notes && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium">
                Review notes
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {verification.review_notes}
              </p>
            </div>
          )}

          {/* Document preview */}
          {documentUrl && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">
                  Submitted document
                </p>
                <p className="text-xs text-muted-foreground">
                  The document submitted for verification
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border bg-muted/20">
                <img
                  src={documentUrl}
                  alt="Organization verification document"
                  className="mx-auto max-h-[500px] w-full object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Link href="/recruiter/profile/verification" className={buttonVariants()}>
              Submit again
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Draft / fallback
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="text-center">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground" />

        <CardTitle className="workspace-section-title mt-4">
          Verification not submitted
        </CardTitle>

        <CardDescription className="workspace-body">
          Complete your organization verification to continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center">
        <Link href="/recruiter/profile/verification" className={buttonVariants()}>
          Start verification
        </Link>
      </CardContent>
    </Card>
  );
};

export default VerificationStatus;
