import { Box } from "@mui/system"
import React from "react"
import Left_section_upper from "./left-section-upper"

const LeftSection: React.FC = () => {
    return <Box
        sx={{
            height: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
        }}
    >
        <Left_section_upper />
        <Box
            sx={{
                flex: 1
            }}
        >
            Main branch build runs
        </Box>
    </Box>
}

export default LeftSection