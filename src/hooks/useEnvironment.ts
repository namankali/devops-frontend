import { useQuery } from "@tanstack/react-query"
import Server from "../service/Server"

export const useEnvironments = () => {
    return useQuery({
        queryKey: ["environments"],
        queryFn: async () => {
            const res = await Server.environmentInfo()
            return res.data || []
        },
    })
}