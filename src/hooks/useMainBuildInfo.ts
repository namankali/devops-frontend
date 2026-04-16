import { useQuery } from "@tanstack/react-query"
import type { MainBranchBuildInfo } from "../helper/interfaces"
import Server from "../service/Server"

export const useBuildTable = () => {
    return useQuery<MainBranchBuildInfo[]>({
        queryKey: ["buildTable"],
        queryFn: async () => {
            const res = await Server.mainBuildBuildInfo()
            console.log("API Response ->> ", res)
            return res.data ?? []
        },
        initialData: []
    })
}