import { Box } from "@mui/system"
import type React from "react"
import Build_failure from "../../../../components/build-failures"
import Pipeline_runs from "../../../../components/pipeline-runs"

const Left_section_upper: React.FC = () => {
    return (
        <Box
            sx={{
                flex: 2,
                display: "flex",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1
                }}
            >
                <Build_failure />

                <Pipeline_runs />
            </Box>
            <Box
                sx={{
                    flex: 1
                }}
            >
                second
            </Box>
        </Box>
    )
}

export default Left_section_upper