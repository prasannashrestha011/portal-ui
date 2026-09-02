"use client";

import { create } from "zustand";
import { authService } from "@/src/services/auth";
import type { MeResponseData } from "@/src/types/auth";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: MeResponseData | null;
  status: AuthStatus;
  setUser: (user: MeResponseData) => void;
  clearUser: () => void;
  initializeAuth: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",
  setUser: (user: MeResponseData) => set({ user, status: "authenticated" }),
  clearUser: () => set({ user: null, status: "unauthenticated" }),
  initializeAuth: async () => {
    if (get().status !== "idle") return;

    set({ status: "loading" });

    try {
      const response = await authService.me();
      set({ user: response.data, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },
  isAuthenticated: () => !!get().user,
}));
