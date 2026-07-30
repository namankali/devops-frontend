import { Box, useTheme } from "@mui/system"
import type React from "react"
import Build_failure from "../../../../components/build-failures"
import Pipeline_runs from "../../../../components/pipeline-runs"
import BuildRunGrid from "../../../../components/buildRunsGrid"

const Left_section_upper: React.FC = () => {
    const theme = useTheme()
    return (
        <Box
            sx={{
                flex: 2,
                display: "flex",
                minHeight: 0,
                gap: 1
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
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",


                    "&::-webkit-scrollbar": {
                        width: 8,
                    },

                    "&::-webkit-scrollbar-track": {
                        background: theme.palette.background.default,
                        borderRadius: 8,
                    },

                    "&::-webkit-scrollbar-thumb": {
                        background: theme.palette.primary.main,
                        borderRadius: 8,
                    },

                    "&::-webkit-scrollbar-thumb:hover": {
                        background: theme.palette.primary.dark,
                    },

                    scrollbarWidth: "thin",
                    scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.default}`,
                }}
            >
                <BuildRunGrid />
            </Box>
        </Box>
    )
}

export default Left_section_upper