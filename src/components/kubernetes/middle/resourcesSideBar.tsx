import { Card, CardContent, List, ListItemButton, Typography } from "@mui/material"

import { KubernetesStore } from "../../../helper/useKubernetesStore"


const ResourcesSidebar: React.FC = () => {
    const { selectedResource, setSelectedResource } = KubernetesStore()
    const resources = [
        { id: "pods", label: "Pods" },
        { id: "deployments", label: "Deployments" },
        { id: "replicaSets", label: "ReplicaSets" },
        { id: "daemonSets", label: "DaemonSets" },
        { id: "jobs", label: "Jobs" },
        { id: "cronJobs", label: "CronJobs" },
        { id: "services", label: "Services" },
        { id: "ingress", label: "Ingress" },
        { id: "configMaps", label: "ConfigMaps" },
        { id: "secrets", label: "Secrets" },
        { id: "persistentVolumes", label: "Persistent Volumes" },
        { id: "namespaces", label: "Namespaces" },
    ] as const;
    return (
        <Card sx={{
            height: "100%",
            backgroundColor: "transparent"
        }} elevation={0}>
            <CardContent sx={{
                // backgroundColor: "transparent"
            }}>
                <Typography fontWeight={600} variant="h6">Resources</Typography>
                <List>
                    {resources.map((resource) => {
                        return (
                            <ListItemButton
                                key={resource.id}
                                selected={selectedResource === resource.id}
                                onClick={() => setSelectedResource(resource.id)}
                            >{resource.label}</ListItemButton>
                        )
                    })}
                </List>
            </CardContent>
        </Card>
    )
}

export default ResourcesSidebar