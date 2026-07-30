import { useQuery } from "@tanstack/react-query"
import Server from "../service/Server"

export const UseKubernetesEvents = (namespace?: string) => {
    return useQuery({
        queryKey: ["event-details", namespace],
        queryFn: async () => {
            const res = await Server.kubernetesEventsDetails(namespace)

            return res.data
        },
        enabled: !!namespace
    })
}