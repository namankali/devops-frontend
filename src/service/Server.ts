import axios from "axios";
import Cookies from "js-cookie";
import Toast from "../utils/toast";
import type { Login_in } from "../utils/types";

export default class Server {
    static BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
    static onLogout: (() => void) | null = null;
    static refreshPromise: Promise<any> | null = null

    static setLogoutCallback(callback: any) {
        this.onLogout = callback;
    }


    static async makeRequest<T = unknown>(
        method: string,
        endpoint: string,
        data: { [key: string]: any } = {},
        params: Record<string, any> = {},
        hasRetried: boolean = false
    ): Promise<T> {
        try {
            console.log("API Call =>>", endpoint, new Date().toString());
            const access_token = Cookies.get("x-access-token")

            const response = await axios({
                method,
                url: `${this.BASE_URL}${endpoint}`,
                data,
                params,
                headers: {
                    ...(data instanceof FormData ? {} : { "Content-Type": "application/json" }),
                    "x-access-token": access_token || ""
                },
                withCredentials: true
            })

            return response.data
        } catch (error: any) {
            if (!error.response) {
                Toast.error("Backend server is not reachable")
                throw error
            }

            const status = error.response.status;
            const message = error?.response?.data?.message.toLowerCase() || ""

            const isRefreshing = endpoint === "/users/refresh"

            if (status === 401 && !isRefreshing && !hasRetried && (
                message?.includes("token expired") || message?.includes("token verification failed")
            )) {
                try {
                    if (!this.refreshPromise) {
                        this.refreshPromise = axios.post(
                            `${this.BASE_URL}/users/refresh`,
                            {},
                            { withCredentials: true }
                        );
                    }

                    await this.refreshPromise;
                    this.refreshPromise = null

                    return this.makeRequest(
                        method,
                        endpoint,
                        data,
                        params,
                        true
                    );

                } catch (refreshError) {
                    this.refreshPromise = null;

                    Cookies.remove("x-access-token");
                    Cookies.remove("refresh-token");

                    if (typeof this.onLogout === "function") {
                        this.onLogout();
                    }

                    throw refreshError;
                }
            }
            throw error.response?.data || {
                message: "Something went wrong",
                status: 500,
            };
        }
    }

    // Users
    static async signin(obj: Login_in) {
        return this.makeRequest("post", "/api/users/v1/login", obj)
    }


    // events
    static async get_build_count() {
        return this.makeRequest("get", "/api/actions/v1/pipeline")
    }

    static async buildRunInfo() {
        return this.makeRequest("get", "/api/actions/v1/info/build")
    }
    
    static async mainBuildBuildInfo() {
        return this.makeRequest("get", "/api/actions/v1/info/main")
    }
    
    static async buildDurationChart() {
        return this.makeRequest("get", "/api/actions/v1/build/chart")
    }
    
    
}   