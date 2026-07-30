import { Card, Box, Typography, LinearProgress } from "@mui/material"

interface Props {
    type: string,
    cpu_percentage: number,
    memory_percentage: number
}
const ResourceDetailsCard: React.FC<Props> = ({ type, cpu_percentage, memory_percentage }) => {
    const percentage = type === "CPU" ? cpu_percentage : memory_percentage;

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            justifyContent: "space-between",
            width: "100%",
            p: 1
            // bgcolor: "transparent",

        }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography variant="h5">{`${type} Usage`}</Typography>
                <Box sx={{ display: "flex", alignItems: "baseline" }}>
                    <Typography variant="h5">{`${percentage} %`}</Typography>
                </Box>
            </Box>
            <Box>
                <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor:"#2b3445",

                        "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            backgroundColor:`${type === "CPU" ? "#3b82f6" :"#97ce44"}`
                        }
                    }}
                />
            </Box>
        </Box>
    )
}

export default ResourceDetailsCard