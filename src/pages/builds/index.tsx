import { Box } from "@mui/system";
import type React from "react";
import LeftSection from "./left-section";
import RightSection from "./right-section";

const Builds: React.FC = () => {
    return (
        <Box
            sx={{
                height: "100%",
                overflow: "auto",
                display: "flex",
            }}
        >
            <LeftSection />
            <RightSection />
        </Box>
    )
}

export default Builds