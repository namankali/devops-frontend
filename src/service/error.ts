export class ApiError extends Error {
    private status: number
    constructor(
        message: string,
        status: number
    ) {
        super(message)
        this.name = "ApiError"
        this.status = status
    }
}