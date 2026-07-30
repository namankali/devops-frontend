import Server from "../service/Server"
import { useQuery } from "@tanstack/react-query";

const useKubernetesInfo = (
    namespace: string = "default",
    provider: string = "",
    environment: string,
    enabled: boolean
) => {
    return useQuery({
        queryKey: ["kuberentes_info", namespace, provider, environment],
        queryFn: async () => {
            const res = await Server.kubernetesInfo(namespace, provider, environment)
            return res.data ?? {}
        },
        initialData: {},
        enabled
    })
}

export default useKubernetesInfo