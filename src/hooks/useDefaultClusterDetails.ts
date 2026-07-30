import { useQuery } from "@tanstack/react-query"
import Server from "../service/Server"

export const useDefaultClusterDetails = () => {
    return useQuery({
        queryKey: ["default_cluster_details"],
        queryFn: async () => {
            const res = await Server.kubernetesDefaultCluster()
            return res.data ?? []
        },
        initialData: []
    })
}