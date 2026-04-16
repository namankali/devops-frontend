export type BuildStatus = "success" | "failed" | "running" | "default";

export type BuildDuration = {
    id: string,
    duration: number,
    date: string
}

export type ApiResponse<T> = {
    data: T,
}