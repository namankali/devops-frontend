import { useEffect, useState } from "react";
import Server from "../service/Server";
import type { ApiResponse, BuildDuration } from "../helper/types";
import { useQuery } from "@tanstack/react-query";

// const useBuildDurationChart = () => {
//     const [data, setData] = useState<BuildDuration[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await Server.buildDurationChart() as ApiResponse<BuildDuration[]>;
//                 setData(res.data ?? []);
//             } catch (err: any) {
//                 setError(err?.message || "Something went wrong");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     return { data, loading, error };
// };

const useBuildDurationChart = () => {
    return useQuery({
        queryKey: ["build_duration_chart"],
        queryFn: async () => {
            const res = await Server.buildDurationChart()
            return res.data as BuildDuration[] ?? []
        }
    })
}

export default useBuildDurationChart;