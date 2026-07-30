import { Grid } from "@mui/system";
import type React from "react";
import RecentEvents from "./recent_events";
import CustomLineChart from "../../customLineChart";
import { UsePodUsage } from "../../../hooks/usePodUsage";
import { KubernetesStore } from "../../../helper/useKubernetesStore";
import PodStatusChart from "./podStatusChart";
import { useResources } from "../../../hooks/useResources";
import { reducedPodDetails } from "../../../helper/format";

// const podStatusDummyData = [
//     { name: "Running", value: 310, color: "#22c55e" },
//     { name: "Pending", value: 8, color: "#f59e0b" },
//     { name: "Failed", value: 4, color: "#ef4444" },
//     { name: "Succeeded", value: 2, color: "#3b82f6" },
// ];
const LowerKubernetesSection: React.FC = () => {
    const { selectedNamespace, selectedProvider, selectedEnvironment } = KubernetesStore()
    const { data } = UsePodUsage(selectedNamespace)
    const { data: podsDetails } = useResources("pods", selectedNamespace, selectedProvider, selectedEnvironment)
    const reducedPodDetailsData = reducedPodDetails(podsDetails.rows)
    return (
        <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, lg: 2.5 }}>
                <PodStatusChart data={reducedPodDetailsData} />
            </Grid>
            <Grid size={{ xs: 12, lg: 2.5 }}>
                <CustomLineChart
                    data={data}
                    type="cpu"
                />
            </Grid>
            <Grid size={{ xs: 12, lg: 2.5 }}>
                <CustomLineChart
                    data={data}
                    type="memory"
                />
            </Grid>
            <Grid size={{ xs: 12, lg: 4.5 }}><RecentEvents /></Grid>
        </Grid>
    )
}

export default LowerKubernetesSection