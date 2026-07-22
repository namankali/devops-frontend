
import { Box } from "@mui/system"
import type { BuildStatus } from "../../helper/types"


const getStatusColor = (state: BuildStatus) => {
    if (state === "success") return "#22c55e"
    else if (state === "failed") return "#ef4444"
    else return "#9ca3af"
}

interface Props {
    state: BuildStatus
}
export const StatusIndicator: React.FC<Props> = ({ state }) => {
    return (
        <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: getStatusColor(state) }} />
    )
}