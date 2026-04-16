import { Box } from "@mui/system"
import React from "react"
import Left_section_upper from "./left-section-upper"
import LeftSectionLower from "./left-section-lower"

const LeftSection: React.FC = () => {
    return <Box
        sx={{
            height: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1
        }}
    >
        <Left_section_upper />
        <Box
            sx={{
                flex: 1
            }}
        >
            <LeftSectionLower />
        </Box>
    </Box>
}

export default LeftSection