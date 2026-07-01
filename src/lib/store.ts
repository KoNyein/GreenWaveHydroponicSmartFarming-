import { create } from "zustand";
import type { Profile } from "@/types/database";
import { mockProfile } from "@/lib/mock-data";

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: Profile | null) => void;
  updateProfile: (profile: Partial<Profile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async () => {
    // In production, this would call Supabase auth
    set({ user: mockProfile, isAuthenticated: true, isLoading: false });
    return true;
  },

  register: async (_email: string, _password: string, fullName: string): Promise<boolean> => {
    const newUser: Profile = {
      ...mockProfile,
      full_name: fullName,
      role: "member",
    };
    set({ user: newUser, isAuthenticated: true, isLoading: false });
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  },

  updateProfile: (profile) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...profile } : state.user,
      isAuthenticated: !!state.user,
      isLoading: false,
    }));
  },
}));

interface SidebarState {
  isCollapsed: boolean;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));

type Theme = "light" | "dark";
type Locale = "en" | "my";

interface SettingsState {
  theme: Theme;
  locale: Locale;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLocale: (locale: Locale) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: "light",
  locale: "en",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  setLocale: (locale) => set({ locale }),
}));
