import { Box } from "@mui/system"
import React from "react"
import { useTheme } from "@mui/material"
import RightUpper from "./rightUpper"
import RightMiddle from "./rightMiddle"
import RightLower from "./rightLower"
const RightSection: React.FC = () => {
    const theme = useTheme()
    return <Box
        sx={{
            height: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            // backgroundColor: theme.palette.background.paper
        }}
    >
        <RightUpper />
        <RightMiddle />
        <RightLower />
    </Box>
}

export default RightSection