import { Box, Card, CardContent, LinearProgress, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, Skeleton } from "@mui/material";
import { Cylinder, Wrench, Boxes, Workflow, Box as LucidBox, Rocket } from "lucide-react";
import type { KubernetesStats } from "../../helper/interfaces";

import useKubernetesInfo from "../../hooks/useKubernetesInfo";
import { useEffect, useState } from "react";
import Server from "../../service/Server";
import UpperKubernetesSection from "../../components/kubernetes/upper";
import MiddleKubernetesSection from "../../components/kubernetes/middle";
import { KubernetesStore } from "../../helper/useKubernetesStore";
const stats: KubernetesStats[] = [
    {
        title: "clusters",
        value: 0,
        sub_value: 0,
        icon: Boxes,
        color: "#00d5ff"
    },
    {
        title: "nodes",
        value: 0,
        sub_value: 0,
        icon: Workflow,
        color: "#8b5cf6"
    },
    {
        title: "pods",
        value: 0,
        sub_value: 0,
        icon: LucidBox,
        color: "#ef4444"
    },
    {
        title: "deployments",
        value: 0,
        sub_value: 0,
        icon: Rocket,
        color: "#f59e0b"
    },
    {
        title: "services",
        value: 0,
        sub_value: 0,
        icon: Wrench,
        color: "#06b6d4"
    },
    {
        title: "persistent Volumes",
        value: 0,
        sub_value: 0,
        icon: Cylinder,
        color: "#8b5cf6"
    }
]
const Kubernetes: React.FC = () => {
    const { selectedNamespace, setSelectedNamespace } = KubernetesStore()
   
    const [namespaces, setNamespaces] = useState([])
    const [kubeInfo, setKubeInfo] = useState(stats)


    const { data: kubeInfoAPI, refetch, isLoading } = useKubernetesInfo(selectedNamespace)


    useEffect(() => {
        const fetch = async () => {
            const apiResponse = await Server.namespacesInfo()

            setNamespaces((prev) => apiResponse.data ?? [])
        }

        fetch()

    }, [])

    useEffect(() => {
        if (!kubeInfoAPI) return;

        setKubeInfo((prev) => prev.map((obj) => {
            const apiCard = kubeInfoAPI.find((item) => item.title === obj.title)

            if (!apiCard) return obj

            return {
                ...obj,
                value: apiCard.value,
                sub_value: apiCard.sub_value,
            }
        }))
    }, [kubeInfoAPI])



    if (isLoading) return <Skeleton variant="rectangular" height={250} />

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
                color: "#e5e7eb",
                background:
                    "radial-gradient(circle at top left, #10233f 0%, #07111f 38%, #050b14 100%)",
                p: { xs: 2, md: 3 },
                gap: 2,
            }}
        >
            <UpperKubernetesSection
                refetch={refetch}
                namespace={selectedNamespace}
                kubeInfo={kubeInfo}
                namespaces={namespaces}
                setNamespace={setSelectedNamespace}
                setNamespaces={setNamespaces}
            />
            <Box sx={{ flex: 3 }}>
                <MiddleKubernetesSection />
            </Box>
            <Box sx={{ flex: 2 }}>lastOne</Box>
        </Box >
    )
}

export default Kubernetes