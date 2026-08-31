import { useQuery } from "@tanstack/react-query"
import Server from "../service/Server"

export const useKubernetesDashboard = (clusterName?: string) => {

    const selectedCluster =
        clusterName?.trim() || undefined;

    return useQuery({
        queryKey: ["dashboard-kubernetes", selectedCluster],

        queryFn: async () => {

            const res = await Server.dashboard_kubernetes(
                selectedCluster
            );

            return res.data ?? {};
        },
    });
};