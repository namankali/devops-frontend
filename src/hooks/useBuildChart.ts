import { useEffect, useState } from "react";
import Server from "../service/Server";
import type { ApiResponse, BuildDuration } from "../helper/types";

const useBuildDurationChart = () => {
    const [data, setData] = useState<BuildDuration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Server.buildDurationChart() as ApiResponse<BuildDuration[]>;
                setData(res.data ?? []);
            } catch (err: any) {
                setError(err?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export default useBuildDurationChart;