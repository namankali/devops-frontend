import { Box } from "@mui/system";
import type React from "react";
import ShieldIcon from "@mui/icons-material/Security";
import { Chip, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const AssistantHeader: React.FC = () => {
    return (
        <Box
            sx={{
                px: 3,
                py: 2,
                borderBottom: "1px solid #1e293b",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            {/* Left */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <ShieldIcon color="success" />

                <Box>
                    <Typography fontWeight="bold">AI Assistant</Typography>
                </Box>

                {/* <Chip label="v1.0.0" size="small" /> */}
                <Chip label="Development" size="small" color="success" />

            </Box>

            {/* Right */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <Typography variant="body2">System Status: Online</Typography>
                <SettingsIcon />
            </Box>

        </Box>
    )
}

export default AssistantHeader