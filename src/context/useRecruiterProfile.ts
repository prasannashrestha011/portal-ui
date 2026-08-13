import { create } from "zustand";
import { employerService } from "../services/recruiterProfile";
import { EmployerProfile, UpsertEmployerProfileRequest } from "../types/recruiterProfile";
import { Company } from "../types/company";

interface RecruiterProfileState {
    isInitialized: boolean;
    profile: EmployerProfile | null;
    myCompany: Company | null;
    loading: boolean;
    error: string | null;
    initialize: () => Promise<void>;
    fetchProfile: () => Promise<void>;
    saveProfile: (payload: UpsertEmployerProfileRequest) => Promise<void>;
    updateLogo: (logo: File) => Promise<void>;
    reset: () => void;
}

export const useRecruiterProfileStore = create<RecruiterProfileState>((set, get) => ({
    isInitialized: false,
    profile: null,
    loading: false,
    error: null,
    myCompany: null,
    initialize: async () => {
        if (get().isInitialized || get().loading) return;
        set({ loading: true, error: null });
        try {

            await Promise.all([get().fetchProfile()]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            set({ error: err.message || "Failed to initialize employer profile." });
        }
        finally {
            set({ loading: false, isInitialized: true });
        }
    },

    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            const data = await employerService.getMyProfile();
            set({ profile: data, loading: false });
        } catch {
            // 404 = no profile yet, not an unhandled error state
            set({ profile: null, loading: false });
        }
    },

    saveProfile: async (payload) => {
        set({ error: null });
        try {
            const data = await employerService.upsertMyProfile(payload);
            set({ profile: data });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || "Failed to save profile.";
            set({ error: errorMsg });
            throw new Error(errorMsg);
        }
    },
    updateLogo: async (logo: File) => {
        set({ loading: true, error: null });
        try {
            console.log("Updating logo with file:", logo);
            const data = await employerService.updateLogo(logo);
            const url = data.organization_logo;

            if (url) {
                const current = get().profile;
                if (!current) {
                    // no profile to merge into — bail or handle as an error state
                    set({ loading: false });
                    return;
                }

                console.log("Logo updated successfully. New URL:", url);
                set({
                    profile: { ...current, organization_logo: url } as EmployerProfile,
                    loading: false,
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            set({ error: err.message || "Failed to update logo.", loading: false });
        }
    },
    reset: () => set({ profile: null, loading: false, error: null }),
}));