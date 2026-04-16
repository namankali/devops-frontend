import { Box } from "@mui/system";
import type React from "react";
import { Typography, useTheme } from "@mui/material"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
    { name: "Publish Test Results", value: 10 },
    { name: "Run Smoke Tests", value: 8 },
    { name: "API Test", value: 7 },
    { name: "Install Dependencies", value: 6 },
    { name: "Validation", value: 6 },
];

const COLORS = [
    "#38bdf8",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
];

const TaskFailureChart: React.FC = () => {
    const total = data.reduce((sum, d) => sum + d.value, 0)
    const theme = useTheme()
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
            }}
        >
            <Typography>
                Task Failures
            </Typography>

            <Box
                sx={{ position: "relative", width: "100%", height: "85%" }}
            >
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={100}
                            outerRadius={120}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {
                                data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))
                            }

                        </Pie>

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "none",
                                color: "white"
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform:"translate(-50%, -50%)"
                    }}
                >
                    <Typography variant="h2" fontWeight="bold">
                        {total}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default TaskFailureChart
