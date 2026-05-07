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

export interface JobQueueData {
    date: string;
    jobs: number
}

export interface SingleMessage {
    id: number,
    conversation_id: number,
    role: string,
    content: string,
    status: string,
    created_at: string,
    updated_at: string
}

export interface MessagesObj {
    conversation_id: number,
    title: string,
    messages: SingleMessage[]
}

export interface StartConvo {
    message: string
}


