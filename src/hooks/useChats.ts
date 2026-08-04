import { useCallback, useEffect, useState } from "react"
import Server from "../service/Server"
import type { MessagesObj } from "../helper/interfaces"

interface QueryData {
    limit: number,
    offset: number
}

const useChats = () => {
    const [queryData, setQueryData] = useState<QueryData>({
        limit: 20,
        offset: 0
    })

    const [data, setData] = useState({} as MessagesObj)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)

    const fetchData = useCallback(async () => {
        if (!hasMore) return

        try {
            const res = await Server.chats(queryData.limit, queryData.offset)
            const newData = res.data[0]

            if (!newData || !newData.messages?.length) {
                setHasMore(false)
                return
            }

            if (newData.messages.length < queryData.limit) {
                setHasMore(false)
            }

            setData((prev) => {
                if (!prev.messages) {
                    const sorted = [...newData.messages].sort(
                        (a, b) =>
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                    )

                    return {
                        ...newData,
                        messages: sorted
                    }
                }

                const combined = [
                    ...prev.messages,
                    ...newData.messages
                ]

                const unique = Array.from(
                    new Map(combined.map(m => [m.id, m])).values()
                ).sort(
                    (a, b) =>
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                )

                return {
                    ...prev,
                    ...newData,
                    messages: unique
                }
            })

        } catch (err: any) {
            setError(err?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }, [queryData, hasMore])

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
        setQueryData
    }
}

export default useChats