import { Card, CardContent, Typography, Box, capitalize } from "@mui/material";
import type React from "react";
import type { KubernetesStats } from "../../../helper/interfaces";

interface CustomCardProps {
    item: KubernetesStats;
    kubernetes: boolean;
}

const CustomCard: React.FC<CustomCardProps> = ({
    item,
    kubernetes = false,
}) => {
    const Icon = item.icon;

    const getSubLabel = (title: string): string => {
        switch (title.toLowerCase()) {
            case "clusters":
                return item.sub_value === item.value
                    ? "Connected"
                    : "Disconnected";

            case "nodes":
                return "Ready";

            case "deployments":
                return "Available";

            case "pods":
                return "Updating";

            case "services":
                return "Active";

            case "persistent volumes":
                return "Bound";

            default:
                return "";
        }
    };

    const getMainValue = (): string | number => {
        if (item.title.toLowerCase() === "clusters") {
            return item.sub_value === item.value
                ? "Healthy"
                : "Unhealthy";
        }

        return item.value;
    };

    const subLabel = getSubLabel(item.title);

    return (
        <Card
            sx={{
                height: "100%",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid #1e293b",
                color: "#e5e7eb",
                borderRadius: 3,
                cursor:
                    item.title === "Total Repos"
                        ? "pointer"
                        : "default",
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    {/* Icon */}
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: "grid",
                            placeItems: "center",
                            backgroundColor: `${item.color}22`,
                            color: item.color,
                            flexShrink: 0,
                        }}
                    >
                        <Icon size={28} />
                    </Box>

                    {/* Card Content */}
                    <Box>
                        <Typography
                            color="#94a3b8"
                            variant="h6"
                            fontWeight={400}
                        >
                            {item.title === "clusters" ? "Cluster" : capitalize(item.title)}
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={800}
                        >
                            {getMainValue()}
                        </Typography>

                        {subLabel && (
                            <Typography
                                color="#22c55e"
                                fontSize={16}
                                mt={1}
                            >
                                {item.title.toLowerCase() === "clusters"
                                    ? subLabel
                                    : `${item.sub_value} ${subLabel}`}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CustomCard;