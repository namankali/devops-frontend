import { Box } from "@mui/system";
import { useBuildRunsInfo } from "../../hooks/useBuildRuns";
import type { BuildStatus } from "../../helper/types";
import type { BuildRun } from "../../helper/interfaces";
import CustomSkeleton from "../loader/customSkeleton";
import { capitalize, Tooltip } from "@mui/material";
import { formattedDate } from "../../helper/format";
import React from "react";

const BuildRunGrid: React.FC = () => {
    const { data, isLoading } = useBuildRunsInfo()

    // console.log("dataaaaa", data)


    const colorMap: Record<BuildStatus, string> = {
        success: "#16a34a",
        failed: "#dc2626",
        running: "#f59e0b",
        default: "#1f2937",
    }

    if (isLoading) {
        return <CustomSkeleton />
    }

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(120px,1fr))"
            gap={1.5}
            sx={{
                pr: 1
            }}
        >
            {
                data.map((obj: any) => (
                    <Tooltip
                        title={
                            <Box>
                                <div><strong>Repo:</strong> {obj.repo_name}</div>
                                <div><strong>Status:</strong> {capitalize(obj.status)}</div>
                                <div><strong>Status:</strong> {formattedDate(obj.created_at)}</div>
                            </Box>
                        }
                        placement="top-end"
                        arrow
                    >
                        <Box
                            key={obj.id}
                            height={60}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius={3}
                            fontWeight={600}
                            fontSize={13}
                            color="#fff"
                            sx={{
                                background: `linear-gradient(135deg, ${colorMap[obj.status]}cc, ${colorMap[obj.status]})`,
                                backdropFilter: "blur(6px)",
                                cursor: "pointer",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",

                                "&:hover": {
                                    transform: "translateY(-2px) scale(1.04)",
                                    boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
                                    opacity: 0.95,
                                },

                                "&:active": {
                                    transform: "scale(0.98)",
                                },
                            }}
                        >
                            {obj.repo_name.split("-")[0].slice(0, 3)}-
                            {obj.repo_name.split("-")[1]}-
                            {obj.run_id}
                        </Box>
                    </Tooltip>
                ))
            }
        </Box >
    )
}

export default React.memo(BuildRunGrid)