import { Box } from "@mui/system";
import type React from "react";

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

        </Box>
    )
}

export default AssistantHeader