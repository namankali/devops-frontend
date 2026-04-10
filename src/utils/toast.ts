import toast from "react-hot-toast"

type ToastMessage = {
    loading?: string;
    success?: string;
    error?: string
}



const Toast = {
    success: (msg: string = "Success!") => toast.success(msg),
    error: (msg: string = "Something went worng") => toast.error(msg),
    info: (msg: string) => toast(msg, { icon: "ℹ️" }),
    promise: (<T>(promise: Promise<T>, messages: ToastMessage) => toast.promise(
        promise,
        {
            loading: messages.loading || "Processing...",
            success: messages.success || "Done",
            error: messages.error || "Failed!"
        }
    )

    )
}

export default Toast