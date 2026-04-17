import type React from "react";
import type { JobQueueData } from "../../../helper/interfaces";
import { Skeleton } from "@mui/material";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Box, palette, useTheme } from "@mui/system";

interface Props {
    data: JobQueueData[];
    isLoading?: boolean;
}
const JobQueuesCard: React.FC<Props> = ({ data, isLoading }) => {
    const theme = useTheme()

    if (isLoading) {
        return <Skeleton variant="rectangular" height={250} />;
    }

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                // flex: 1
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    {/* Gradient */}
                    <defs>
                        <linearGradient
                            id="jobGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor={theme.palette.primary.main}
                                stopOpacity={0.9}
                            />
                            <stop
                                offset="100%"
                                stopColor={theme.palette.secondary.main}
                                stopOpacity={0.6}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                    />

                    <XAxis stroke={theme.palette.text.secondary} dataKey="date" tick={{ fontSize: 12 }} />

                    <YAxis dataKey="jobs" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />

                    <Tooltip
                        contentStyle={{
                            // backgroundColor: theme.palette.background.paper,
                            backgroundColor: "rgba(20, 25, 40, 0.9)",
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 8,
                            backdropFilter: "blur(6px)"
                        }}
                        labelStyle={{ color: theme.palette.text.secondary, fontSize: 12 }}
                        itemStyle={{
                            color: "theme.palette.text.primary",
                            fontSize: 13
                        }}
                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />

                    <Bar
                        dataKey="jobs"
                        fill="url(#jobGradient)"
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    )
}

export default JobQueuesCard