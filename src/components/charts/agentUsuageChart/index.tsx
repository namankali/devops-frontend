import { Box } from "@mui/system";
import type React from "react";
import { Typography, useTheme } from "@mui/material";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
    data: { date: string; usage: number }[];
    isLoading?: boolean;
}

const AgentUsuageChart: React.FC<Props> = ({ data, isLoading }) => {
    const theme = useTheme()

    if (isLoading) {
        return <Box height={250} bgcolor="rgba(255,255,255,0.05)" />;
    }

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                p:1,
                flexDirection: "column",
                backgroundColor: theme.palette.background.paper,
                border: "1px solid rgba(255,255,255,0.08)",
                // borderRadius: 2
            }}
        >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontWeight={600}>Agents Usage</Typography>
                <Typography variant="caption" color="text.secondary">
                    7 days
                </Typography>
            </Box>

            <Box
                sx={{ flex: 1 }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                    >
                        <CartesianGrid
                            stroke={theme.palette.divider}
                            strokeDasharray="3 3"
                        />

                        <XAxis dataKey="date" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />

                        <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(20,25,40,0.95)",
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 8,
                                backdropFilter: "blur(6px)",
                            }}
                            labelStyle={{
                                color: theme.palette.text.secondary,
                            }}
                            itemStyle={{
                                color: theme.palette.text.primary,
                            }}
                            cursor={{ stroke: theme.palette.primary.main, strokeWidth: 1 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="usage"
                            stroke={theme.palette.primary.main}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    )
}

export default AgentUsuageChart