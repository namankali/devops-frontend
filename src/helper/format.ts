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


const reverseChats = (data: MessagesObj): MessagesObj => {
    if (!data?.messages) return data;

    return {
        ...data,
        messages: [...data.messages].reverse()
    };
};

const filteredPodDetails = (data: PodDetails): PodOverview => {
    let filtered_value = {} as PodOverview

    for (let key in data) {
        if (key !== "cpu_usage" && key !== "memory_usage" && key !== "yaml") {
            // filtered_value[key as keyof PodOverview] = data[key as keyof PodDetails]
            filtered_value[key] = data[key]
        }
    }

    return filtered_value
}


export {
    formattedDate,
    convertDateToMinAndSec,
    reverseChats,
    filteredPodDetails
}