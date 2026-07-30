import { capitalize, Typography } from "@mui/material"
import { Box, useTheme } from "@mui/system"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface Props {
    data: any,
    type: string
}
const CustomLineChart: React.FC<Props> = ({ data, type }) => {
    const theme = useTheme()
    const dataKey = type === "cpu" ? "cpu_usage_millicores" : "memory_usage_mib"
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
                {`${capitalize(type)} Usage (All Pods)`}
            </Typography>

            <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid stroke="#1e293b" />

                        {/* x-axis */}
                        <XAxis
                            dataKey="time"
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
                            dataKey={dataKey}
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

export default CustomLineChart