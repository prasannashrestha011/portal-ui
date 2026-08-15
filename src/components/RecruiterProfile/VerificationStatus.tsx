"use client";

import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";

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

          <p className="mt-4 text-sm text-muted-foreground">
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

          <h2 className="mt-4 text-lg font-semibold">
            No verification found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40">
            <Clock3 className="h-7 w-7 text-amber-600" />
          </div>

          <CardTitle className="mt-4">
            Verification under review
          </CardTitle>

          <CardDescription>
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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>

          <CardTitle className="mt-4">
            Organization verified
          </CardTitle>

          <CardDescription>
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
                <p className="mt-1 text-sm font-medium text-green-600">
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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
            <XCircle className="h-7 w-7 text-red-600" />
          </div>

          <CardTitle className="mt-4">
            Verification rejected
          </CardTitle>

          <CardDescription>
            Your organization verification could not be approved.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {verification.rejection_reason && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Rejection reason
              </p>

              <p className="mt-1 text-sm text-red-600 dark:text-red-300">
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
            <Button >
              <a href="/employer/profile/verification">
                Submit again
              </a>
            </Button>
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

        <CardTitle className="mt-4">
          Verification not submitted
        </CardTitle>

        <CardDescription>
          Complete your organization verification to continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center">
        <Button >
          <a href="/employer/profile/verification">
            Start verification
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerificationStatus;
