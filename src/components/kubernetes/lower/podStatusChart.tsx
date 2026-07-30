import { Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

interface Props {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
}


const PodStatusChart: React.FC<Props> = ({ data }) => {
    const theme = useTheme();

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Typography variant="h6">
                Pod Status
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ width: 220, height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={3}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        flex: 1,
                    }}
                >
                    {data.map((item) => (
                        <Box
                            key={item.name}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        bgcolor: item.color,
                                    }}
                                />

                                <Typography variant="body2">
                                    {item.name}
                                </Typography>
                            </Box>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {item.value} (
                                {((item.value / total) * 100).toFixed(1)}%)
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default PodStatusChart;