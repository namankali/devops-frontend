import { Box } from "@mui/system";
import type React from "react";
import LeftSection from "./left-section";
import RightSection from "./right-section";
import { useContext, useEffect, useState } from "react";
import { HeaderFooterContext } from "../../helper/headerFooterContext";
import Server from "../../service/Server";

const Builds: React.FC = () => {
    const [successRate, setSuccessRate] = useState({})
    // const { setDisabled } = useContext(HeaderFooterContext)
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const apiResponse = await Server.successRateData()

                if (mounted) setSuccessRate(apiResponse.data ?? {})
            } catch (error) {
                console.error("Failed to agent usage details", error);

                if (mounted) setSuccessRate({});
            }
        }

        fetchData()

        return () => {
            mounted = false;
        };
    }, [])

    console.log("success rate data", successRate)

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
            <RightSection
                successRate={successRate}
            />
        </Box>
    )
}

export default Builds