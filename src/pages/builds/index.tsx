import { Box } from "@mui/system";
import type React from "react";
import LeftSection from "./left-section";
import RightSection from "./right-section";
import { useContext, useEffect } from "react";
import { HeaderFooterContext } from "../../helper/headerFooterContext";

const Builds: React.FC = () => {
    // const { setDisabled } = useContext(HeaderFooterContext)
    // useEffect(() => {
    //     setDisabled(true)

    //     return () => {
    //         setDisabled(true)
    //     }
    // }, [setDisabled])

    return (
        <Box
            sx={{
                height: "100%",
                overflow: "auto",
                display: "flex",
                gap: 1
            }}
        >
            <LeftSection />
            <RightSection />
        </Box>
    )
}

export default Builds