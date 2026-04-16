import { Box } from "@mui/system"
import React from "react"
import RightUpper from "./rightUpper"
import RightMiddle from "./rightMiddle"
import RightLower from "./rightLower"
const RightSection: React.FC = () => {
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