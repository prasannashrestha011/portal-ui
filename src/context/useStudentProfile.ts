import { create } from "zustand";
import { StudentProfile } from "../types/studentProfile";
import { studentService } from "../services/studentProfile";

interface StudentProfileState {
    profile: StudentProfile | null;
    loading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    saveProfile: (payload: StudentProfile) => Promise<void>;
    reset: () => void;
}

export const useStudentProfileStore = create<StudentProfileState>((set) => ({
    profile: null,
    loading: false,
    error: null,

    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            const res = await studentService.getProfile();
            set({ profile: res.data, loading: false });
        } catch {
            // 404 = no profile yet, not an error state
            set({ profile: null, loading: false });
        }
    },

    saveProfile: async (payload) => {
        set({ error: null });
        try {
            const res = await studentService.upsertProfile(payload);
            set({ profile: res.data });
        } catch {
            set({ error: "Failed to save profile." });
            throw new Error("Failed to save profile.");
        }
    },

    reset: () => set({ profile: null, loading: false, error: null }),
}));