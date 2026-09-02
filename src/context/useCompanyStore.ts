/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import type {
    AddTeamMemberPayload,
    Company,
    CreateCompanyPayload,
    UpdateCompanyPayload,
} from '../types/company';
import { companyService } from '../services/company';

interface CompanyState {
    company: Company | null;
    searchResults: Company[];
    loading: boolean;
    saving: boolean;
    uploadingLogo: boolean;
    searching: boolean;
    error: string | null;

    fetchMyCompany: () => Promise<void>;
    searchCompanies: (query: string) => Promise<Company[]>;
    createCompany: (payload: CreateCompanyPayload) => Promise<Company>;
    updateCompany: (id: string, payload: UpdateCompanyPayload) => Promise<void>;
    deleteCompany: (id: string) => Promise<void>;
    uploadLogo: (id: string, file: File) => Promise<void>;
    addTeamMember: (companyId: string, payload: AddTeamMemberPayload) => Promise<void>;
    removeTeamMember: (companyId: string, userId: string) => Promise<void>;
    reset: () => void;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
    company: null,
    searchResults: [],
    loading: false,
    saving: false,
    uploadingLogo: false,
    searching: false,
    error: null,

    fetchMyCompany: async () => {
        set({ loading: true, error: null });
        try {
            const data = await companyService.getMyCompany();
            console.log("Fetched company data:", data);
            set({ company: data, loading: false });
        } catch {
            // 404 means no company is linked to this account yet
            set({ company: null, loading: false });
        }
    },

    searchCompanies: async (query: string) => {
        if (!query.trim()) {
            set({ searchResults: [] });
            return [];
        }
        set({ searching: true, error: null });
        try {
            const results = await companyService.searchCompanies(query);
            set({ searchResults: results, searching: false });
            return results;
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to search companies.';
            set({ searchResults: [], searching: false, error: msg });
            return [];
        }
    },

    createCompany: async (payload) => {
        set({ saving: true, error: null });
        try {
            const newCompany = await companyService.createCompany(payload);
            set({ company: newCompany, saving: false });
            return newCompany;
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to create company.';
            set({ error: msg, saving: false });
            throw new Error(msg);
        }
    },

    updateCompany: async (id, payload) => {
        set({ saving: true, error: null });
        try {
            const updated = await companyService.updateCompany(id, payload);
            set({ company: updated, saving: false });
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to update company.';
            set({ error: msg, saving: false });
            throw new Error(msg);
        }
    },

    deleteCompany: async (id) => {
        set({ saving: true, error: null });
        try {
            await companyService.deleteCompany(id);
            set({ company: null, saving: false });
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to delete company.';
            set({ error: msg, saving: false });
            throw new Error(msg);
        }
    },

    uploadLogo: async (id, file) => {
        set({ uploadingLogo: true, error: null });
        try {
            const updated = await companyService.uploadLogo(id, file);
            set({ company: updated, uploadingLogo: false });
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to upload logo.';
            set({ error: msg, uploadingLogo: false });
            throw new Error(msg);
        }
    },

    addTeamMember: async (companyId, payload) => {
        set({ saving: true, error: null });
        try {
            await companyService.addTeamMember(companyId, payload);
            // Re-fetch company details to update employee list
            await get().fetchMyCompany();
            set({ saving: false });
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to add team member.';
            set({ error: msg, saving: false });
            throw new Error(msg);
        }
    },

    removeTeamMember: async (companyId, userId) => {
        set({ saving: true, error: null });
        try {
            await companyService.removeTeamMember(companyId, userId);
            // Re-fetch company details to reflect member removal
            await get().fetchMyCompany();
            set({ saving: false });
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to remove team member.';
            set({ error: msg, saving: false });
            throw new Error(msg);
        }
    },

    reset: () => set({
        company: null,
        searchResults: [],
        loading: false,
        saving: false,
        uploadingLogo: false,
        searching: false,
        error: null
    }),
}));
