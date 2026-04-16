import { useQuery } from "@tanstack/react-query"
import Server from "../service/Server"

export const useBuildRunsInfo = () => {
    return useQuery({
        queryKey: ["buildRunGrid"],
        queryFn: async () => {
            const res = await Server.buildRunInfo()
            return res.data ?? []
        },
        initialData: []
    })
}