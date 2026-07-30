export type BuildStatus = "success" | "failed" | "running" | "default";

export type BuildDuration = {
    id: string,
    duration: number,
    date: string
}

export type BuildChart = {
    id: string;
    duration: number;
};

export type BuildRun = {
    id: string;
    status: string;
};

export type ApiResponse<T> = {
    data: T,
    success?: boolean;
    message?: string;
}

export type LoginResponse = {
    success: boolean;
    token?: string;
};

export type PipelineStats = {
    total_builds: number;
    failed_builds: number;
};

export type PodDetails = {
    name: string,
    namespace: string,
    node: string,
    status: string,
    ip: string,
    created: string,
    age: string,
    cpu_usage: string,
    memory_usage: string,
    yaml: string
}

export type PodOverview = Omit<PodDetails, "cpu_usage" | "memory_usage" | "yaml">

export type Environment =
    | "Development"
    | "Staging"
    | "Production"