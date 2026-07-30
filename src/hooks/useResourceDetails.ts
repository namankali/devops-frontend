// useResourceDetails.ts
import { useQuery } from "@tanstack/react-query";
import Server from "../service/Server";

export const useResourceDetails = (
    name?: string,
    namespace?: string,
    resource?: string,
    provider?: string,
    environment?: string
) => {
    return useQuery({
        queryKey: ["resource-details", resource, namespace, name],
        queryFn: async () => {
            const res = await Server.fetchResourceSpecificDetails(
                name!,
                namespace!,
                resource!,
                provider,
                environment
            );
            return res.data;
        },
        enabled: !!name && !!namespace && !!resource && !!provider && !!environment,
    });
};