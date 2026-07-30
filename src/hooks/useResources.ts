import { useQuery } from "@tanstack/react-query";
import Server from "../service/Server";

export const useResources = (
    resource: string,
    namespace: string = "default",
    provider: string,
    environment: string
) => {
    return useQuery({
        queryKey: ["kuberentes_resources", resource, namespace, provider, environment],
        queryFn: async () => {
            const res = await Server.resourcesDetails(resource, namespace, provider, environment)

            return res.data ?? { columns: [], rows: [] }
        },
        initialData: {},
        enabled: !!namespace && !!provider && !!environment
    })
}