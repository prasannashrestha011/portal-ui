import { User } from "./auth";
import { OrganizationVerification } from "./organizationVerification";


export interface RecruiterProfile {
  id: string;
  user_id: string;
  organization_name: string;
  designation?: string;
  organization_logo?: string;
  organization_website?: string;
  organization_address?: string;
  industry?: string;
  organization_size?: string;
  organization_about?: string;
  user?: User;
  created_at: string;
  updated_at: string;
  verification_status: "draft" | "pending" | "approved" | "rejected";
  verification: OrganizationVerification
}

export interface UpsertRecruiterProfileRequest {
  organization_name: string;
  designation?: string;
  organization_website?: string;
  organization_address?: string;
  industry?: string;
  organization_size?: string;
  organization_about?: string;

  // profile/me/logo
  organization_logo?: File;
}

// Compatibility aliases for components that use employer-facing terminology.
export type EmployerProfile = RecruiterProfile;
export type UpsertEmployerProfileRequest = UpsertRecruiterProfileRequest;
