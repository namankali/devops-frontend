import { useQuery } from "@tanstack/react-query"
import Server from "../service/Server"

export const UsePodUsage = (namespace?: string) => {
    return useQuery({
        queryKey: ["pod-usage", namespace],
        queryFn: async () => {
            const res = await Server.podUsage(namespace)
            return res.data
        },
        enabled: !!namespace
    })
}