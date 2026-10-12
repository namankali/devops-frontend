import { Box } from "@mui/system";
import type React from "react";
import JobQueueChart from "../../../../components/charts/jobQueues";
import AgentUsuageChart from "../../../../components/charts/agentUsuageChart";
import { useEffect, useState } from "react";
import Server from "../../../../service/Server";

const data = [
    { date: "Jan 01", usage: 4.0 },
    { date: "Jan 03", usage: 3.8 },
    { date: "Jan 05", usage: 3.6 },
    { date: "Jan 07", usage: 3.4 },
    { date: "Jan 09", usage: 3.3 },
    { date: "Jan 11", usage: 3.2 },
];

const RightLower: React.FC = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const apiResponse = await Server.agentUsage()

                if (mounted) setData(apiResponse.data ?? [])
            } catch (error) {
                console.error("Failed to agent usage details", error);

                if (mounted) setData([]);
            }
        }

        fetchData()

        return () => {
            mounted = false;
        };
    }, [])

    return (
        <Box
            sx={{
                flex: 2,
                display: "flex",
                gap: 1,
                height: "100%"
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    height: "100%"
                }}
            >
                <JobQueueChart />
            </Box>

            <Box
                sx={{
                    flex: 1,
                    height: "100%"
                }}
            >
                <AgentUsuageChart
                    data={data}
                    isLoading={false}
                />
            </Box>
        </Box>
    )
}

export default RightLower