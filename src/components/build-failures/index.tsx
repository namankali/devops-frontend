import type React from "react";
import { Paper, Typography, useTheme } from "@mui/material";
const Build_failure: React.FC = () => {
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
            <Typography variant="h1">2</Typography>
            <Typography variant="h6">Build Failures</Typography>
        </Paper>
    )
}

export default Build_failure