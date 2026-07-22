import { useQuery } from "@tanstack/react-query";
import Server from "../service/Server";

export const useResources = (resource: string, namespace: string = "default") => {
    return useQuery({
        queryKey: ["kuberentes_resources", resource, namespace],
        queryFn: async () => {
            const res = await Server.resourcesDetails(resource, namespace)

            return res.data ?? { columns: [], rows: [] }
        },
        initialData: {}
    })
}