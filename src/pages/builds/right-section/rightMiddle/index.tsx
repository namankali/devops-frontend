import { Box } from "@mui/system";
import type React from "react";
import MetricCard from "../../../../components/customCard/MetricCard";

interface Props {
    successRate: Record<string, string>
}

const RightMiddle: React.FC<Props> = ({ successRate }) => {
    return (
        <Box
            sx={{ flex: 1, display: "flex", gap: 1 }}
        >
            <MetricCard
                title="Builds in Progress"
                value={1}
                subtitle="Builds in Progress"
            />
            <MetricCard
                title="Build Success Rate"
                value={successRate.success_rate}
            />
        </Box>
    )
}

export default RightMiddle