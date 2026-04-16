import moment from "moment"

const formattedDate = (date: string) => {
    return moment(date).format("YYYY-MM-DD")
}

const convertDateToMinAndSec = (seconds: string) => {
    const totalSeconds = Math.floor(Number(seconds))

    const minutes = Math.floor(totalSeconds / 60)
    const sec = Math.floor(totalSeconds % 60)

    return `${minutes} minutes ${sec} seconds`
}



export {
    formattedDate,
    convertDateToMinAndSec
}