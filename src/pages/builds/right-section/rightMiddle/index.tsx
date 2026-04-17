import { Box } from "@mui/system";
import type React from "react";
import MetricCard from "../../../../components/customCard/MetricCard";

const RightMiddle: React.FC = () => {
    return (
        <Box
            sx={{ flex: 1, display: "flex", gap: 1 }}
        >
            <MetricCard
                title="Builds in Progress"
                value={3}
                subtitle="Builds in Progress"
            />
            <MetricCard
                title="Build Failures"
                value={70}
                subtitle="Build Failures"
            />
        </Box>
    )
}

export default RightMiddle