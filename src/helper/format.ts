import moment from "moment"
import type { MessagesObj } from "./interfaces"
import type { PodDetails, PodOverview } from "./types"

const formattedDate = (date: string) => {
    return moment(date).local().format("YYYY-MM-DD")
}

const convertDateToMinAndSec = (seconds: string) => {
    const totalSeconds = Math.floor(Number(seconds))

    const minutes = Math.floor(totalSeconds / 60)
    const sec = Math.floor(totalSeconds % 60)

    return `${minutes} minutes ${sec} seconds`
}


function formatDuration(seconds: number | null | undefined): string {
    if (seconds == null || !Number.isFinite(seconds)) {
        return "N/A";
    }

    const totalSeconds = Math.round(seconds);

    if (totalSeconds < 60) {
        return `${totalSeconds}s`;
    }

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    if (minutes < 60) {
        return remainingSeconds
            ? `${minutes}m ${remainingSeconds}s`
            : `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
}

function formatRelativeTime(timestamp: number): string {
    const eventTime = timestamp * 1000;
    const difference = Math.max(0, Date.now() - eventTime);

    const minutes = Math.floor(difference / 60_000);
    const hours = Math.floor(difference / 3_600_000);
    const days = Math.floor(difference / 86_400_000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;

    return `${days}d ago`;
}

const reverseChats = (data: MessagesObj): MessagesObj => {
    if (!data?.messages) return data;

    return {
        ...data,
        messages: [...data.messages].reverse()
    };
};

const filteredPodDetails = (data: PodDetails): PodOverview => {
    const filtered_value = {} as PodOverview

    for (const key in data) {
        if (key !== "cpu_usage" && key !== "memory_usage" && key !== "yaml") {
            // filtered_value[key as keyof PodOverview] = data[key as keyof PodDetails]
            filtered_value[key] = data[key]
        }
    }

    return filtered_value
}

const reducedPodDetails = (data: any) => {
    let running_pods = 0
    let pending_pods = 0
    let failed_pods = 0
    let succeeded_pods = 0

    data?.forEach((obj: any) => {
        if (obj.status === "Running") {
            running_pods += 1
        } else if (obj.status === "Pending") {
            pending_pods += 1
        } else if (obj.status === "Failed") {
            failed_pods += 1
        } else {
            succeeded_pods += 1
        }
    })

    return [
        { name: "Running", value: running_pods, color: "#22c55e" },
        { name: "Pending", value: pending_pods, color: "#f59e0b" },
        { name: "Failed", value: failed_pods, color: "#ef4444" },
        { name: "Succeeded", value: succeeded_pods, color: "#3b82f6" },
    ];
}

const remove_undescore = (text: string) => {
    if (text) {
        return text.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    }
    return text
}

const UpperCaseFirstLetter = (text: string) => {
    if (text) {
        return text.replace(/\b\w/g, c => c.toUpperCase())
    }
    return text
}

const add_undescore = (text: string) => {
    if (text) {
        return text.replace(/ /g, "_").replace(/\b\w/g, c => c.toUpperCase())
    }
    return text
}


export {
    formattedDate,
    convertDateToMinAndSec,
    formatRelativeTime,
    reverseChats,
    filteredPodDetails,
    reducedPodDetails,
    remove_undescore,
    add_undescore,
    UpperCaseFirstLetter,
    formatDuration
}