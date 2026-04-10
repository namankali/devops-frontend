import type React from "react";
import { Paper, Typography, useTheme } from "@mui/material";
const Pipeline_runs: React.FC = () => {
    const theme = useTheme()
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
            <Typography variant="h1">75</Typography>
            <Typography variant="h6">Pipelines Runs</Typography>
        </Paper>
    )
}

export default Pipeline_runs