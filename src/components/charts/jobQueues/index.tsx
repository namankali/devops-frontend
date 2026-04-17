import { Card, CardContent, Typography } from "@mui/material";
import type React from "react";
import { Box, useTheme } from "@mui/system";
import JobQueuesCard from "./JobQueuesCard";
import type { JobQueueData } from "../../../helper/interfaces";

const data = [
    { date: "Jan 7", jobs: 1 },
    { date: "Jan 8", jobs: 6 },
    { date: "Jan 9", jobs: 4 },
    { date: "Jan 10", jobs: 4 },
    { date: "Jan 11", jobs: 3 },
] as JobQueueData[]
const isLoading = false

const JobQueueChart: React.FC = () => {
    const theme = useTheme()
    return (
        <Card
            sx={{
                backgroundColor: theme.palette.background.paper,
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                height: "100%"
            }}
        >
            <CardContent
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    mb={2}
                >
                    <Typography variant="h6" fontWeight={600}>
                        Job Queues
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        7 days
                    </Typography>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                    }}
                >
                    <JobQueuesCard
                        data={data}
                        isLoading={isLoading}
                    />
                </Box>
            </CardContent>
        </Card>
    )
}

export default JobQueueChart