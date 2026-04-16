import { Paper, Typography, useTheme } from "@mui/material";
import usePipelineStats from "../../hooks/usePipelineStats";
const Build_failure: React.FC = () => {
    const theme = useTheme()
    const { failedRuns } = usePipelineStats()
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                flex: 1,
                backgroundColor: theme.palette.background.paper,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Typography variant="h1">{failedRuns}</Typography>
            <Typography variant="h6">Build Failures</Typography>
        </Paper>
    )
}

export default Build_failure