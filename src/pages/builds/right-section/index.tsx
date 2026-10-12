import { Box } from "@mui/system"
import React from "react"
import RightUpper from "./rightUpper"
import RightMiddle from "./rightMiddle"
import RightLower from "./rightLower"

interface Props {
    successRate: Record<string, string>
}

const RightSection: React.FC<Props> = ({ successRate }) => {
    return <Box
        sx={{
            height: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1
            // backgroundColor: theme.palette.background.paper
        }}
    >
        <RightUpper />
        <RightMiddle
            successRate={successRate}
        />
        <RightLower />
    </Box>
}

export default RightSection