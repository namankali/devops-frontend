import Server from "../service/Server"
import { useQuery } from "@tanstack/react-query";

const useKubernetesInfo = (namespace: string = "default") => {
    return useQuery({
        queryKey: ["kuberentes_info", namespace],
        queryFn: async () => {
            const res = await Server.kubernetesInfo(namespace)
            return res.data ?? []
        },
        initialData: []
    })
}

export default useKubernetesInfo