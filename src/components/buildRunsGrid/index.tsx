import { Box } from "@mui/system";
import { useBuildRunsInfo } from "../../hooks/useBuildRuns";
import type { BuildStatus } from "../../helper/types";
import type { BuildRun } from "../../helper/interfaces";
import CustomSkeleton from "../loader/customSkeleton";
import { capitalize, Tooltip } from "@mui/material";
import { formattedDate } from "../../helper/format";

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
                    >
                        <Box
                            key={obj.id}
                            height={60}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius={2}
                            fontWeight={600}
                            fontSize={14}
                            color="#fff"
                            sx={{
                                backgroundColor: colorMap[obj.status] || colorMap.default,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                "&:hover": {
                                    opacity: 0.85,
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            {obj.repo_name.split("-")[0].slice(0, 3)}-{obj.repo_name.split("-")[1]}-{obj.run_id}
                        </Box>
                    </Tooltip>
                ))
            }
        </Box >
    )
}

export default BuildRunGrid