import { useQuery } from "@tanstack/react-query";
import Server from "../service/Server";

export const useDashboardSummary = ()=>{
    return useQuery({
        queryKey:["dashboardSummary"],
        queryFn: async()=>{
            const res = await Server.dashboard_summary()
            return res.data
        }
    })
}