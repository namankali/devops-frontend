import { useEffect, useState } from "react";
import Server from "../service/Server";

const usePipelineStats = () => {
    const [count, setCount] = useState({
        totalRuns: 0,
        failedRuns: 0
    });

    useEffect(() => {
        const fetch = async () => {
            const fetchData = await Server.get_build_count();

            setCount({
                failedRuns: fetchData.data.failed_builds ?? 0,
                totalRuns: fetchData.data.total_builds ?? 0,
            });
        };

        fetch();
    }, []);

    return {
        totalRuns: count.totalRuns,
        failedRuns: count.failedRuns
    };
};

export default usePipelineStats;