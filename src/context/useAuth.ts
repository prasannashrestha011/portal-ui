"use client";

import { create } from "zustand";
import type { MeResponseData } from "@/src/types/auth";

interface AuthState {
  user: MeResponseData | null;
  setUser: (user: MeResponseData) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user: MeResponseData) => set({ user }),
  clearUser: () => set({ user: null }),
  isAuthenticated: () => !!get().user,
}));
