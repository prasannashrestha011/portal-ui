import { create } from "zustand";
import { employerService } from "../services/employerProfile";
import { EmployerProfile, UpsertEmployerProfileRequest } from "../types/employerProfile";

interface EmployerProfileState {
    profile: EmployerProfile | null;
    loading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    saveProfile: (payload: UpsertEmployerProfileRequest) => Promise<void>;
    reset: () => void;
}

export const useEmployerProfileStore = create<EmployerProfileState>((set) => ({
    profile: null,
    loading: false,
    error: null,

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

    reset: () => set({ profile: null, loading: false, error: null }),
}));