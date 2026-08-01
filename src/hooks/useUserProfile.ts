import { useQuery } from "@tanstack/react-query"
import Server from "../service/Server";

export const UseUserProfile = (options: any = {}) => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await Server.userProfile();

            return res?.data || {};
        },
        enabled: options.enabled ?? true,
        staleTime: 5 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false
    })
}