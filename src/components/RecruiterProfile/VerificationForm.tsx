"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { employerService } from "@/src/services/recruiterProfile";
import { useRecruiterProfileStore } from "@/src/context/useRecruiterProfile";

const VerificationForm = () => {
  const profile = useRecruiterProfileStore((state) => state.profile);

  const [documentType, setDocumentType] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [organizationEmail, setOrganizationEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const verificationStatus = profile?.verification_status;

  const resetForm = () => {
    setDocumentType("");
    setDocument(null);
    setOrganizationEmail("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!organizationEmail.trim()) {
      setError("Organization email is required.");
      return;
    }

    if (!documentType) {
      setError("Please select a document type.");
      return;
    }

    if (!document) {
      setError("Please upload a verification document.");
      return;
    }

    try {
      setLoading(true);

      await employerService.submitVerification({
        document_type: documentType,
        organization_email: organizationEmail.trim(),
      });

      await employerService.uploadVerificationDocument(document);

      setSuccess(
        "Your verification request has been submitted successfully."
      );

      resetForm();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit verification."
      );
    } finally {
      setLoading(false);
    }
  };

  // No profile / verification state yet
  if (!profile) {
    return null;
  }

  // Pending state
  if (verificationStatus === "pending") {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning-subtle dark:bg-warning-subtle/60">
            <Clock3 className="h-7 w-7 text-warning-hover" />
          </div>

          <h2 className="workspace-section-title">
            Verification under review
          </h2>

          <p className="workspace-body mt-2 max-w-md text-muted-foreground">
            Your organization verification has been submitted and
            is currently being reviewed by our team.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Verified state
  if (verificationStatus === "approved") {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-subtle dark:bg-success-subtle/60">
            <ShieldCheck className="h-7 w-7 text-success" />
          </div>

          <h2 className="workspace-section-title">
            Organization verified
          </h2>

          <p className="workspace-body mt-2 max-w-md text-muted-foreground">
            Your organization has been successfully verified.
            You can now access all employer features.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Rejected state
  if (verificationStatus === "rejected") {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-subtle dark:bg-error-subtle/60">
            <XCircle className="h-7 w-7 text-error" />
          </div>

          <h2 className="workspace-section-title">
            Verification rejected
          </h2>

          <p className="workspace-body mt-2 max-w-md text-muted-foreground">
            Your organization verification was rejected. Please
            review your documents and submit a new verification
            request.
          </p>

          <Button
            type="button"
            className="mt-6"
            onClick={resetForm}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Draft state — show verification form
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle">
            <FileText className="h-5 w-5 text-primary" />
          </div>

          <div>
            <CardTitle className="workspace-section-title">Organization Verification</CardTitle>
            <CardDescription className="workspace-body">
              Upload an official document to verify your
              organization.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="organization-email">
              Organization email
            </Label>

            <Input
              id="organization-email"
              type="email"
              placeholder="contact@company.com"
              value={organizationEmail}
              onChange={(e) =>
                setOrganizationEmail(e.target.value)
              }
            />

            <p className="text-xs text-muted-foreground">
              Enter an official email address associated with
              your organization.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-type">
              Document type
            </Label>

            <Select
              value={documentType}
              onValueChange={(value) => setDocumentType(value ?? "")}
            >
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="registration_certificate">
                  Business Registration Certificate
                </SelectItem>

                <SelectItem value="company_license">
                  Company License
                </SelectItem>

                <SelectItem value="tax_certificate">
                  Tax Registration Certificate
                </SelectItem>

                <SelectItem value="other">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-document">
              Verification document
            </Label>

            <div className="rounded-xl border border-dashed p-6">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium">
                    Upload your document
                  </p>

                  <p className="text-sm text-muted-foreground">
                    PDF, JPG, or PNG
                  </p>
                </div>

                <Input
                  id="verification-document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setDocument(
                      e.target.files?.[0] ?? null
                    )
                  }
                  className="max-w-sm cursor-pointer"
                />

                {document && (
                  <p className="text-sm text-muted-foreground">
                    Selected:{" "}
                    <span className="font-medium text-foreground">
                      {document.name}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {loading
              ? "Submitting..."
              : "Submit for verification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VerificationForm;
