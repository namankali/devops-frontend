import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import type React from "react";
import { useTheme } from "@mui/material"
import useBuildDurationChart from "../../../hooks/useBuildChart";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"
import CustomSkeleton from "../../loader/customSkeleton";

interface BuildDurationChart_ {
    branchName: string
}

const BuildDurationChart: React.FC<BuildDurationChart_> = (props) => {
    const theme = useTheme()
    const { data, loading } = useBuildDurationChart()

    if (loading) {
        return <CustomSkeleton />
    }

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
                p: 2,
                color: "white",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1
                // justifyContent: "center",
                // alignItems: "center"
            }}
        >
            <Typography>
                Build Duration for {props.branchName} Branch
            </Typography>

            <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid stroke="#1e293b" />

                        {/* x-axis */}
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                        />

                        {/* YAxis */}
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "none",
                                color: "white"
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="duration"
                            stroke="#38bdf8"
                            strokeWidth={2}
                            dot={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    )
}

export default BuildDurationChart