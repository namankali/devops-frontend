import { Box, Typography } from "@mui/material";
import type React from "react";

const LogHeader: React.FC = () => {
    return (
        <Box mb={3}>
            <Typography variant="h4" fontWeight="bold">
                Log Viewer
            </Typography>

            <Typography>
                D
            </Typography>
        </Box>
    )
}

export default LogHeader