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