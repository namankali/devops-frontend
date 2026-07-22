import { Card, CardContent, Typography, Box, capitalize } from "@mui/material";
import type React from "react";
import type { KubernetesStats } from "../../../helper/interfaces";

interface CustomCardProps {
    item: KubernetesStats,
    kubernetes: boolean
}
const CustomCard: React.FC<CustomCardProps> = ({ item, kubernetes = false }) => {
    const Icon = item.icon
    const subValue = (title = ""): string => {
        if (title == "clusters") {
            return "healthy"
        } else if (title === "nodes") {
            return "ready"
        } else if (title === "pods") {
            return "updating"
        } else if (title === "services") {
            return "active"
        } else {
            return "bound"
        }
    }
    return (
        <Card
            sx={{
                height: "100%",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid #1e293b",
                color: "#e5e7eb",
                borderRadius: 3,
                cursor: item.title === "Total Repos" ? "pointer" : "default",
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: "grid",
                            placeItems: "center",
                            backgroundColor: `${item.color}22`,
                            color: item.color
                        }}
                    >
                        <Icon size={28} />
                    </Box>

                    <Box>
                        <Typography color="#94a3b8" variant="h6" fontWeight={400}>
                            {capitalize(item.title)}
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                            {item.value}
                        </Typography>
                        <Typography color="#22c55e" fontSize={16} mt={1}>
                            {item.sub_value} {capitalize(subValue(item.title))}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default CustomCard