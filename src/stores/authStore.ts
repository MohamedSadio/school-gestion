import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'DIRECTEUR' | 'COMPTABLE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loginAttempts: number;
  lockedUntil: number | null;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  incrementAttempts: () => void;
  resetAttempts: () => void;
  isLocked: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      loginAttempts: 0,
      lockedUntil: null,
      setAuth: (user, token, refreshToken) =>
        set({ user, token, refreshToken, loginAttempts: 0, lockedUntil: null }),
      logout: () =>
        set({ user: null, token: null, refreshToken: null }),
      incrementAttempts: () => {
        const attempts = get().loginAttempts + 1;
        const lockedUntil = attempts >= 5 ? Date.now() + 15 * 60 * 1000 : null;
        set({ loginAttempts: attempts, lockedUntil });
      },
      resetAttempts: () => set({ loginAttempts: 0, lockedUntil: null }),
      isLocked: () => {
        const { lockedUntil } = get();
        if (!lockedUntil) return false;
        if (Date.now() > lockedUntil) {
          set({ loginAttempts: 0, lockedUntil: null });
          return false;
        }
        return true;
      },
    }),
    { name: 'auth-storage' }
  )
);
