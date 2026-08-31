import { useQuery } from "@tanstack/react-query"
import Server from "../service/Server"

export const UseKubernetesEvents = (namespace: string, provider?: string, env?: string) => {
    return useQuery({
        queryKey: ["event-details", namespace, provider, env],
        queryFn: async () => {
            const res = await Server.kubernetesEventsDetails(namespace, provider, env)

            return res.data
        },
        enabled: !!namespace
    })
}