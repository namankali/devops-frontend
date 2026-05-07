import { useQuery } from "@tanstack/react-query"
import Server from "../service/Server"

export const useRepoDetailsCount = () => {
    return useQuery({
        queryKey: ["repo_count"],
        queryFn: async () => {
            const res = await Server.dashboard_repo_details_count()
            console.log("check api dtaa", res)
            return res.data ?? []
        },
        initialData: []
    })
}