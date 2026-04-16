import { useEffect, useState } from "react";
import Server from "../service/Server";

const useBuildDurationChart = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Server.buildDurationChart();
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