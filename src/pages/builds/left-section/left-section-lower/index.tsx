import { Box } from "@mui/system";
import type React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import type { BuildStatus } from "../../../../helper/types";
import { useBuildTable } from "../../../../hooks/useMainBuildInfo";
import type { MainBranchBuildInfo } from "../../../../helper/interfaces";
import { convertDateToMinAndSec } from "../../../../helper/format";
import CustomSkeleton from "../../../../components/loader/customSkeleton";

const getStatusColor = (state: BuildStatus) => {
    if (state === "success") return "#22c55e"
    else if (state === "failed") return "#ef4444"
    else return "#9ca3af"
}


const LeftSectionLower: React.FC = () => {
    const theme = useTheme()
    const { data: rows, isLoading } = useBuildTable()

    if (isLoading) {
        return <CustomSkeleton />
    }

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                // borderRadius: 3,
                p: 1,
                color: "white",
                height: "100%"
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Main Branch Build Runs
            </Typography>

            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 260,
                    backgroundColor: theme.palette.background.paper,

                }}
            >
                <Table stickyHeader size="small">
                    {/* Header */}
                    <TableHead>
                        <TableRow>
                            {["State", "Build Number", "Build Run State", "Run Duration", "Pipeline Name"].map((head) => (
                                <TableCell
                                    key={head}
                                    sx={{
                                        backgroundColor: theme.palette.background.default,
                                        fontWeight: theme.typography.h5.fontWeight
                                    }}
                                >
                                    {head}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row: MainBranchBuildInfo) => (
                            <TableRow
                                key={row.id}
                                hover
                                sx={{
                                    "&:hover": {
                                        backgroundColor: theme.palette.primary.main
                                    }
                                }}>
                                <TableCell><Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: getStatusColor(row.state) }} /></TableCell>

                                <TableCell
                                    sx={{
                                        color: "60a5fa",
                                        cursor: "pointer",
                                        "&:hover": { textDecoration: "underline" }
                                    }}
                                >{row.run_number}</TableCell>

                                <TableCell sx={{ color: "#cbd5f5" }}>{row.state}</TableCell>

                                <TableCell sx={{ color: "#94a3b8" }}>{convertDateToMinAndSec(row.duration)}</TableCell>

                                <TableCell sx={{ color: "cbd5f5" }}>{row.pipeline}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default LeftSectionLower