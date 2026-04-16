import type { BuildStatus } from "./types";

export interface BuildRun {
    id: number,
    run_id: number,
    status: BuildStatus,
    created_at: string,
    repo_name: string
}

export interface MainBranchBuildInfo {
    id: number,
    run_number: string,
    duration: string,
    pipeline: string,
    state: BuildStatus,
    status: string
}



