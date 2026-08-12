import axios from "axios";
import Cookies from "js-cookie";
import Toast from "../utils/toast";
import type { Login_in } from "../utils/types";
import type { ApiResponse, BuildChart, BuildRun, LoginResponse, PipelineStats } from "../helper/types";
import type { MainBranchBuildInfo, StartConvo } from "../helper/interfaces";

export default class Server {
    // static BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
    static BASE_URL = ""
    static onLogout: (() => void) | null = null;
    static refreshPromise: Promise<any> | null = null

    static setLogoutCallback(callback: any) {
        this.onLogout = callback;
    }


    static async makeRequest<T = unknown>(
        method: string,
        endpoint: string,
        data: Record<string, any> = {},
        params: Record<string, any> = {},
        hasRetried: boolean = false
    ): Promise<T> {
        try {
            const accessToken = Cookies.get("x-access-token");

            const response = await axios({
                method,
                url: `${this.BASE_URL}${endpoint}`,
                data,
                params,
                headers: {
                    ...(data instanceof FormData
                        ? {}
                        : { "Content-Type": "application/json" }),
                    "x-access-token": accessToken || "",
                },
                withCredentials: true,
            });

            return response.data;
        } catch (error: any) {
            if (!error.response) {
                throw error;
            }

            const status = error.response.status;
            const responseData = error.response.data;

            const message =
                responseData?.message ??
                responseData?.error?.payload?.message ??
                "Something went wrong";

            const isRefreshing = endpoint === "/api/users/refresh";

            // Access token expired
            if (
                status === 401 &&
                responseData?.refreshRequired &&
                !isRefreshing &&
                !hasRetried
            ) {
                try {
                    if (!this.refreshPromise) {
                        this.refreshPromise = axios.post(
                            `${this.BASE_URL}/api/users/v1/refresh`,
                            {},
                            {
                                withCredentials: true,
                            }
                        );
                    }

                    const refreshResponse = await this.refreshPromise;

                    this.refreshPromise = null;

                    // Backend returns new access token
                    if (refreshResponse.data?.access_token) {
                        Cookies.set(
                            "x-access-token",
                            refreshResponse.data.access_token
                        );
                    }

                    return this.makeRequest(
                        method,
                        endpoint,
                        data,
                        params,
                        true
                    );
                } catch (refreshError: any) {
                    this.refreshPromise = null;

                    Cookies.remove("x-access-token");
                    Cookies.remove("refresh-token");

                    this.onLogout?.();

                    throw refreshError;
                }
            }

            // Session invalid / refresh expired
            if (status === 401 && responseData?.forceLogout) {
                Cookies.remove("x-access-token");
                Cookies.remove("refresh-token");

                this.onLogout?.();

                throw responseData;
            }

            throw (
                responseData || {
                    message,
                    status,
                }
            );
        }
    }

    // Users
    static async signin(obj: Login_in): Promise<LoginResponse> {
        return this.makeRequest<LoginResponse>(
            "post",
            "/api/users/v1/login",
            obj
        );
    }

    static async signout(): Promise<any> {
        return this.makeRequest<LoginResponse>(
            "post",
            "/api/users/v1/logout",
        );
    }

    static async userProfile(): Promise<any> {
        return this.makeRequest<any>(
            "get",
            "/api/users/v1/profile"
        );
    }


    // events
    static async get_build_count(): Promise<ApiResponse<PipelineStats>> {
        return this.makeRequest<ApiResponse<PipelineStats>>(
            "get",
            "/api/actions/v1/pipeline"
        );
    }
    static async buildRunInfo(): Promise<ApiResponse<BuildRun[]>> {
        return this.makeRequest<ApiResponse<BuildRun[]>>(
            "get",
            "/api/actions/v1/info/build"
        );
    }

    static async mainBuildBuildInfo(): Promise<ApiResponse<MainBranchBuildInfo[]>> {
        return this.makeRequest<ApiResponse<MainBranchBuildInfo[]>>(
            "get",
            "/api/actions/v1/info/main"
        );
    }


    static async buildDurationChart(): Promise<ApiResponse<BuildChart[]>> {
        return this.makeRequest<ApiResponse<BuildChart[]>>(
            "get",
            "/api/actions/v1/build/chart"
        );
    }

    // Chats

    static async chats(
        limit: number = 10,
        offset: number = 0,
        branch_name: string
    ): Promise<ApiResponse<any>> {
        return this.makeRequest<ApiResponse<any>>(
            "get",
            `/api/chats/v1/stream/${branch_name}`,
            {},
            {
                limit: limit,
                offset: offset
            }
        );
    }

    // Start conversation
    static async start_convo(obj: StartConvo, branch: string): Promise<any> {
        return this.makeRequest<any>(
            "post",
            `/api/chats/v1/chat/${branch}`,
            obj
        )
    }

    // insert message in convsersation
    static async new_chat(obj: any, branch: string): Promise<any> {
        return this.makeRequest<any>(
            "patch",
            `/api/chats/v1/new/message/${branch}`,
            obj
        );
    }


    // Dashboard
    static async dashboard_repo_details_count(): Promise<any> {
        return this.makeRequest<any>(
            "get",
            "/api/actions/v1/dashboard/rd"
        );
    }

    static async dashboard_repo_details(): Promise<any> {
        return this.makeRequest<any>(
            "get",
            "/api/actions/v1/dashboard/repos"
        );
    }

    // Kubernetes
    static async registerKubernetes(data: FormData): Promise<any> {
        console.log("data before api call", data)
        return this.makeRequest<any>(
            "post",
            "/api/kubernetes/v1/register/cluster",
            data
        )
    }
    static async registerationInfo(): Promise<any> {
        return this.makeRequest<any>(
            "get",
            "/api/kubernetes/v1/clusters",
        )
    }

    static async kubernetesInfo(namespace = "default", provider: string, environment: string): Promise<any> {
        return this.makeRequest<any>(
            "get",
            `/api/kubernetes/v1/info/${namespace}/${provider}/${environment}`,
            {},
            {
                "pods": "true",
                "deployments": "true",
                "nodes": "true",
                "services": "true",
                "clusters": "true",
            }
        )
    }

    static async namespacesInfo(provider?: string, env?: string): Promise<any> {
        return this.makeRequest<any>(
            "get",
            "/api/kubernetes/v1/ns",
            {},
            {
                ...(provider && { provider }),
                ...(env && { env })
            }
        )
    }

    static async resourcesDetails(resource: string, namespace: string, provider: string, environment: string): Promise<any> {
        return this.makeRequest<any>(
            "get",
            `/api/kubernetes/v1/resources/${resource}`,
            {},
            {
                namespace,
                provider,
                environment
            }
        )
    }

    static fetchResourceSpecificDetails(
        resourceName: string,
        namespace: string,
        type: string,
        provider: string,
        environment: string
    ): Promise<any> {
        return this.makeRequest<any>(
            "get",
            `/api/kubernetes/v1/resource/detail/${resourceName}/${type}/${namespace}`,
            {},
            {
                provider,
                environment
            }
        )
    }

    static kubernetesEventsDetails(namespace: string): Promise<any> {
        return this.makeRequest<any>(
            "get",
            `/api/kubernetes/v1/events/${namespace}`
        )
    }
    static kubernetesDefaultCluster(): Promise<any> {
        return this.makeRequest<any>(
            "get",
            `/api/kubernetes/v1/curr/cluster`
        )
    }

    static podUsage(namespace: string = "all"): Promise<any> {
        return this.makeRequest<any>(
            "get",
            `/api/kubernetes/v1/pods/usage/${namespace}`
        )
    }

    static providerEnvironmentInfo(provider?: string): Promise<any> {
        return this.makeRequest<any>(
            "get",
            `/api/kubernetes/v1/prov/env`,
            {},
            {
                ...(provider && { provider })
            }
        )
    }
    static environmentInfo(): Promise<any> {
        return this.makeRequest<any>(
            "get",
            `/api/kubernetes/v1/envs`,
        )
    }
}