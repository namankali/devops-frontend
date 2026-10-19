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

export interface KubernetesStats {
    title: string,
    value: number,
    sub_value: number,
    color: string,
    icon: any
}

export interface DashboardActivityEvent {
    event_id: string;
    pipeline_id: string;
    run_id: number;
    run_attempt: number;
    run_number: number;
    event_type: string;
    repository: string;
    branch: string;
    html_url: string;
    status: string;
    timestamp: number;
    duration: number | null;
    severity: number | null;
}