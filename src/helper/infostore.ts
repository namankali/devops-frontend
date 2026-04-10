import { create } from "zustand"
import Cookies from "js-cookie"

type AuthState = {
    token: string | null;
    isAuthenticated: boolean;
    setAuthenticated: (value: boolean) => void;
    setToken: (token: string | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
    token: Cookies.get("x-access-token") || null,
    isAuthenticated: !!Cookies.get("x-access-token"),
    setAuthenticated: (value: boolean) => set({
        isAuthenticated: value
    }),
    setToken: (token: string | null) => set({
        token,
        isAuthenticated: !!token
    })
}))

export default useAuthStore