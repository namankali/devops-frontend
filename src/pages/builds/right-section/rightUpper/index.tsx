import { Box } from "@mui/system";
import type React from "react";
import BuildDurationChart from "../../../../components/charts/build-duration-chart";
import TaskFailureChart from "../../../../components/charts/taskFailureChart";

const RightUpper: React.FC = () => {
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
                <BuildDurationChart
                    branchName="Main"
                />
            </Box>
            <Box
                sx={{
                    flex: 1
                }}
            >
                <TaskFailureChart />
            </Box>
        </Box>
    )
}

export default RightUpper