import type React from "react";
import { Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";

interface Props {
    title: string;
    value: number | string;
    subtitle?: string;
}

const MetricCard: React.FC<Props> = ({
    title,
    value,
    subtitle,
}) => {
    const theme = useTheme();

    const isBuildSuccessRate = title === "Build Success Rate";

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                width: "100%",
            }}
        >
            {/* Title */}
            <Typography>
                {title}
            </Typography>

            {/* Value */}
            <Box
                display="flex"
                justifyContent="center"
                gap={1}
                sx={{
                    alignItems: "center",
                    flex: 1,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 48,
                        fontWeight: 700,
                        lineHeight: 1,
                    }}
                >
                    {isBuildSuccessRate ? `${value}%` : value}
                </Typography>

                {/* Subtitle */}
                {isBuildSuccessRate ? (
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            fontWeight: 500,
                        }}
                    >
                        Success Rate
                    </Typography>
                ) : (
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            fontWeight: 500,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default MetricCard;