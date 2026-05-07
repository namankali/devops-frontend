import moment from "moment"
import type { MessagesObj } from "./interfaces"

const formattedDate = (date: string) => {
    return moment(date).format("YYYY-MM-DD")
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


export {
    formattedDate,
    convertDateToMinAndSec,
    reverseChats
}