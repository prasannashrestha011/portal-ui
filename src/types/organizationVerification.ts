import { RecruiterProfile } from "./recruiterProfile";

export type OrganizationVerificationStatus =
  | "pending"
  | "approved"
  | "rejected";

export type OrganizationVerificationMethod =
  | "domain_email"
  | "document";


export interface ReviewOrganizationVerificationRequest {
  status: OrganizationVerificationStatus;
  rejection_reason?: string;
  review_notes?: string;
}
export interface SubmitVerificationRequest {
  document_type?: string;
  organization_email?: string;
}

export interface OrganizationVerification {
  id: string;

  recruiter_profile_id: string;

  status: OrganizationVerificationStatus;
  method?: OrganizationVerificationMethod;

  // Domain/email verification
  organization_email?: string;
  email_domain?: string;

  // Document verification
  document_type?: string;


  // Reviewer information
  reviewed_by?: string;

  rejection_reason?: string;
  review_notes?: string;

  submitted_at?: string;
  reviewed_at?: string;
  verified_at?: string;

  recruiter_profile?: RecruiterProfile;

  created_at: string;
  updated_at: string;
}
export interface OrganizationVerificationResponse {
  document_url: string;
  verification: OrganizationVerification;
}
