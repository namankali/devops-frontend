import { useCallback, useEffect, useState } from "react"
import Server from "../service/Server"
import type { MessagesObj } from "../helper/interfaces"

interface QueryData {
    limit: number,
    offset: number
}


const useChats = (branchName: string = "development") => {
    const [queryData, setQueryData] = useState<QueryData>({
        limit: 20,
        offset: 0
    })

    const [data, setData] = useState({} as MessagesObj)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        setData({} as MessagesObj)
        setQueryData({ limit: 20, offset: 0 })
        setLoading(true)
        setHasMore(true)
    }, [branchName])

    const fetchData = useCallback(async (): Promise<MessagesObj | null> => {
        if (!hasMore) return null

        try {
            const res = await Server.chats(
                queryData.limit,
                queryData.offset,
                branchName
            )

            const newData = res.data[0]

            if (!newData || !newData.messages?.length) {
                setHasMore(false)
                return
            }

            if (newData.messages.length < queryData.limit) {
                setHasMore(false)
            }

            const sortedNewMessages = [...newData.messages].sort(
                (a, b) =>
                    new Date(a.updated_at).getTime() -
                    new Date(b.updated_at).getTime()
            )

            setData((prev) => {
                // FIRST PAGE / REFRESH
                if (queryData.offset === 0) {
                    return {
                        ...newData,
                        messages: sortedNewMessages
                    }
                }

                // LOAD OLDER MESSAGES
                const combined = [
                    ...(prev.messages || []),
                    ...sortedNewMessages
                ]

                const unique = Array.from(
                    new Map(
                        combined.map((message) => [message.id, message])
                    ).values()
                ).sort(
                    (a, b) =>
                        new Date(a.updated_at).getTime() -
                        new Date(b.updated_at).getTime()
                )

                return {
                    ...prev,
                    ...newData,
                    messages: unique
                }
            })

            return newData

        } catch (err: any) {
            setError(err?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }, [queryData, hasMore, branchName])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        loading,
        error,
        hasMore,
        setData,
        refetch: fetchData,
        setQueryData,
        setHasMore
    }
}

export default useChats