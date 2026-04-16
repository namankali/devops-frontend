import { useEffect, useState } from "react";
import Server from "../service/Server";

const usePipelineStats = () => {
    const [count, setCount] = useState({
        totalRuns: 0,
        failedRuns: 0
    })

    useEffect(() => {
        const fetch = async () => {
            const fetchData = await Server.get_build_count()
            setCount(prev => {
                return {
                    ...prev,
                    failedRuns: fetchData.data.failed_builds,
                    totalRuns: fetchData.data.total_builds,
                }
            })
        }

        fetch()

        // Socket setup
    }, [])

    return {
        totalRuns: count.totalRuns,
        failedRuns: count.failedRuns
    }
}

export default usePipelineStats