import React from "react";
import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export interface AIHealthResult {
    score: number;

    provider: {
        name: string;
        score: number;
        available: boolean;
        details: {
            pod_exists: boolean;
            running: boolean;
            api_check: string;
            reason?: string;
        };
    };

    model: {
        name: string;
        score: number;
        available: boolean;
        details: {
            requested_model: string;
            available_models: string[];
        };
    };

    inference: {
        score: number;
        success_rate: number;
        total_runs: string | number;
        successful_runs: string | number;
        failed_runs: string | number;
    };

    latency: {
        score: number;
        average_ms: number | null;
        p95_ms: number | null;
        sample_size: number;
    };

    tools: {
        score: number;
        success_rate: number | null;
        total_calls: number;
        successful_calls: number;
        failed_calls: number;
    };
}

interface AIHealthScoreDialogProps {
    open: boolean;
    onClose: () => void;
    health: AIHealthResult | null;
}

const getScoreStatus = (score: number) => {
    if (score >= 80) {
        return {
            label: "Healthy",
            color: "#22c55e",
            background: "rgba(34, 197, 94, 0.12)",
        };
    }

    if (score >= 60) {
        return {
            label: "Good",
            color: "#3b82f6",
            background: "rgba(59, 130, 246, 0.12)",
        };
    }

    if (score >= 40) {
        return {
            label: "Fair",
            color: "#f59e0b",
            background: "rgba(245, 158, 11, 0.12)",
        };
    }

    if (score >= 20) {
        return {
            label: "Poor",
            color: "#f97316",
            background: "rgba(249, 115, 22, 0.12)",
        };
    }

    return {
        label: "Critical",
        color: "#ef4444",
        background: "rgba(239, 68, 68, 0.12)",
    };
};

interface MetricCardProps {
    title: string;
    weight: string;
    score: number;
    icon: React.ReactNode;
    description: string;
    children: React.ReactNode;
}

const MetricCard = ({
    title,
    weight,
    score,
    icon,
    description,
    children,
}: MetricCardProps) => {
    const status = getScoreStatus(score);

    return (
        <Box
            sx={{
                flex: 1,
                minWidth: 0,
                border: "1px solid rgba(148, 163, 184, 0.12)",
                borderRadius: 2.5,
                background:
                    "linear-gradient(145deg, rgba(15, 27, 49, 0.95), rgba(10, 20, 38, 0.95))",
                p: 2,
            }}
        >
            {/* Header */}
            <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
                sx={{ mb: 1.8 }}
            >
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(34, 211, 238, 0.10)",
                        color: "#22d3ee",
                    }}
                >
                    {icon}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#e2e8f0",
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#8394ab",
                            mt: 0.3,
                        }}
                    >
                        {weight} Weight
                    </Typography>
                </Box>
            </Stack>

            {/* Score */}
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1.3 }}
            >
                <Typography
                    sx={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#f1f5f9",
                        lineHeight: 1,
                    }}
                >
                    {score}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 15,
                        color: "#64748b",
                    }}
                >
                    /100
                </Typography>

                <Chip
                    label={status.label}
                    size="small"
                    sx={{
                        ml: "auto",
                        height: 24,
                        fontSize: 10,
                        fontWeight: 600,
                        color: status.color,
                        backgroundColor: status.background,
                        border: `1px solid ${status.color}30`,
                    }}
                />
            </Stack>

            <Typography
                sx={{
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: "#94a3b8",
                    minHeight: 38,
                    mb: 1.5,
                }}
            >
                {description}
            </Typography>

            <Divider
                sx={{
                    borderColor: "rgba(148, 163, 184, 0.10)",
                    mb: 1.3,
                }}
            />

            {children}
        </Box>
    );
};

interface DetailRowProps {
    label: string;
    value: React.ReactNode;
}

const DetailRow = ({ label, value }: DetailRowProps) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ mb: 1 }}
        >
            <Typography
                sx={{
                    fontSize: 15,
                    color: "#64748b",
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: 15,
                    color: "#cbd5e1",
                    fontWeight: 500,
                    textAlign: "right",
                    wordBreak: "break-word",
                }}
            >
                {value}
            </Typography>
        </Stack>
    );
};

export default function AIHealthScoreDialog({
    open,
    onClose,
    health,
}: AIHealthScoreDialogProps) {
    if (!health) {
        return null;
    }

    const scoreStatus = getScoreStatus(health.score);

    const latencyHasData = health.latency.sample_size > 0;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    width: "100%",
                    maxWidth: 1550,
                    maxHeight: "90vh",
                    borderRadius: 3,
                    background: "#081326",
                    backgroundImage: "none",
                    border: "1px solid rgba(148, 163, 184, 0.14)",
                    boxShadow:
                        "0 25px 80px rgba(0, 0, 0, 0.55)",
                    overflow: "hidden",
                    padding:2
                },
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: "rgba(2, 8, 23, 0.78)",
                    backdropFilter: "blur(5px)",
                },
            }}
        >
            <DialogContent
                sx={{
                    p: 0,
                    overflow: "auto",
                    color: "#e2e8f0",
                }}
            >
                {/* =====================================================
                    HEADER
                ====================================================== */}

                <Box
                    sx={{
                        px: { xs: 2.5, md: 3 },
                        pt: 2.5,
                        pb: 2,
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 23,
                                    fontWeight: 700,
                                    color: "#f8fafc",
                                }}
                            >
                                AI Health Score Details
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 14,
                                    color: "#64748b",
                                    mt: 0.5,
                                }}
                            >
                                Overview of your AI system health and
                                performance
                            </Typography>
                        </Box>

                        <IconButton
                            onClick={onClose}
                            size="small"
                            sx={{
                                color: "#64748b",
                                "&:hover": {
                                    color: "#e2e8f0",
                                    background:
                                        "rgba(148, 163, 184, 0.08)",
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>

                <Divider
                    sx={{
                        borderColor: "rgba(148, 163, 184, 0.10)",
                    }}
                />

                {/* =====================================================
                    SCORE + SYSTEM INFORMATION
                ====================================================== */}

                <Box
                    sx={{
                        px: { xs: 2.5, md: 3 },
                        py: 2.5,
                    }}
                >
                    <Stack
                        direction={{
                            xs: "column",
                            md: "row",
                        }}
                        spacing={3}
                        alignItems="center"
                    >
                        {/* Score circle */}

                        <Box
                            sx={{
                                position: "relative",
                                width: 150,
                                height: 150,
                                minWidth: 150,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: `
                                    radial-gradient(
                                        circle,
                                        #081326 62%,
                                        transparent 63%
                                    ),
                                    conic-gradient(
                                        #22d3ee ${health.score}%,
                                        rgba(34, 211, 238, 0.10) ${health.score}%
                                    )
                                `,
                                boxShadow:
                                    "0 0 35px rgba(34, 211, 238, 0.12)",
                            }}
                        >
                            <Box sx={{ textAlign: "center" }}>
                                <Typography
                                    sx={{
                                        fontSize: 48,
                                        lineHeight: 1,
                                        fontWeight: 700,
                                        color: "#f8fafc",
                                    }}
                                >
                                    {health.score}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        color: "#64748b",
                                        mt: 0.5,
                                    }}
                                >
                                    /100
                                </Typography>
                            </Box>
                        </Box>

                        {/* Score description */}

                        <Box sx={{ flex: 1 }}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ mb: 1 }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 22,
                                        fontWeight: 600,
                                        color: "#f8fafc",
                                    }}
                                >
                                    AI Health Score
                                </Typography>

                                <Chip
                                    label={scoreStatus.label}
                                    size="small"
                                    sx={{
                                        height: 24,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: scoreStatus.color,
                                        backgroundColor:
                                            scoreStatus.background,
                                    }}
                                />
                            </Stack>

                            <Typography
                                sx={{
                                    fontSize: 15,
                                    lineHeight: 1.7,
                                    color: "#94a3b8",
                                    maxWidth: 450,
                                }}
                            >
                                Your AI system is currently operating
                                normally based on provider availability,
                                model availability, inference success,
                                latency and tool reliability.
                            </Typography>
                        </Box>

                        {/* System information */}

                        <Box
                            sx={{
                                width: {
                                    xs: "100%",
                                    md: 320,
                                },
                                borderRadius: 2.5,
                                border: "1px solid rgba(148, 163, 184, 0.12)",
                                background:
                                    "rgba(15, 27, 49, 0.75)",
                                p: 2,
                            }}
                        >
                            <DetailRow
                                label="Provider"
                                value={health.provider.name}
                            />

                            <DetailRow
                                label="Model"
                                value={health.model.name}
                            />

                            <DetailRow
                                label="Inference Runs"
                                value={health.inference.total_runs}
                            />

                            <DetailRow
                                label="Time Window"
                                value="Last 24 Hours"
                            />
                        </Box>
                    </Stack>
                </Box>

                <Divider
                    sx={{
                        borderColor: "rgba(148, 163, 184, 0.10)",
                    }}
                />

                {/* =====================================================
                    HEALTH BREAKDOWN
                ====================================================== */}

                <Box
                    sx={{
                        px: { xs: 2.5, md: 3 },
                        py: 2.5,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 19,
                            fontWeight: 600,
                            color: "#f1f5f9",
                        }}
                    >
                        Health Breakdown
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#64748b",
                            mt: 0.4,
                            mb: 2,
                        }}
                    >
                        Five metrics contributing to the overall AI
                        Health Score.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.5,
                            flexWrap: {
                                xs: "wrap",
                                lg: "nowrap",
                            },
                        }}
                    >
                        {/* =================================================
                            PROVIDER
                        ================================================== */}

                        <MetricCard
                            title="Provider Availability"
                            weight="20%"
                            score={health.provider.score}
                            icon={
                                <CloudOutlinedIcon fontSize="small" />
                            }
                            description={
                                health.provider.available
                                    ? "AI provider is available and operational."
                                    : "AI provider is currently unavailable."
                            }
                        >
                            <DetailRow
                                label="Provider"
                                value={health.provider.name}
                            />

                            <DetailRow
                                label="Pod Exists"
                                value={
                                    health.provider.details.pod_exists
                                        ? "Yes"
                                        : "No"
                                }
                            />

                            <DetailRow
                                label="Pod Status"
                                value={
                                    health.provider.details.running ? (
                                        <Stack
                                            direction="row"
                                            spacing={0.7}
                                            alignItems="center"
                                        >
                                            <CheckCircleOutlineIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: "#22c55e",
                                                }}
                                            />
                                            <span>Running</span>
                                        </Stack>
                                    ) : (
                                        "Not Running"
                                    )
                                }
                            />
                        </MetricCard>

                        {/* =================================================
                            MODEL
                        ================================================== */}

                        <MetricCard
                            title="Model Availability"
                            weight="15%"
                            score={health.model.score}
                            icon={
                                <MemoryOutlinedIcon fontSize="small" />
                            }
                            description={
                                health.model.available
                                    ? "Requested model is available and ready to use."
                                    : "Requested model is not available."
                            }
                        >
                            <DetailRow
                                label="Model"
                                value={health.model.name}
                            />

                            <DetailRow
                                label="Status"
                                value={
                                    health.model.available ? (
                                        <Stack
                                            direction="row"
                                            spacing={0.7}
                                            alignItems="center"
                                        >
                                            <CheckCircleOutlineIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: "#22c55e",
                                                }}
                                            />
                                            <span>Available</span>
                                        </Stack>
                                    ) : (
                                        "Unavailable"
                                    )
                                }
                            />

                            <DetailRow
                                label="Available Models"
                                value={
                                    health.model.details.available_models
                                        ?.length ?? 0
                                }
                            />
                        </MetricCard>

                        {/* =================================================
                            INFERENCE
                        ================================================== */}

                        <MetricCard
                            title="Inference Success"
                            weight="30%"
                            score={health.inference.score}
                            icon={
                                <SmartToyOutlinedIcon fontSize="small" />
                            }
                            description="Measures whether AI requests are completing successfully."
                        >
                            <DetailRow
                                label="Success Rate"
                                value={`${health.inference.success_rate}%`}
                            />

                            <DetailRow
                                label="Total Runs"
                                value={health.inference.total_runs}
                            />

                            <DetailRow
                                label="Successful Runs"
                                value={health.inference.successful_runs}
                            />

                            <DetailRow
                                label="Failed Runs"
                                value={health.inference.failed_runs}
                            />
                        </MetricCard>

                        {/* =================================================
                            LATENCY
                        ================================================== */}

                        <MetricCard
                            title="Latency"
                            weight="25%"
                            score={health.latency.score}
                            icon={
                                <SpeedOutlinedIcon fontSize="small" />
                            }
                            description={
                                latencyHasData
                                    ? "Measures AI response performance."
                                    : "Latency data is not available yet."
                            }
                        >
                            <DetailRow
                                label="Average Latency"
                                value={
                                    health.latency.average_ms !== null
                                        ? `${health.latency.average_ms} ms`
                                        : "N/A"
                                }
                            />

                            <DetailRow
                                label="P95 Latency"
                                value={
                                    health.latency.p95_ms !== null
                                        ? `${health.latency.p95_ms} ms`
                                        : "N/A"
                                }
                            />

                            <DetailRow
                                label="Samples"
                                value={health.latency.sample_size}
                            />

                            {!latencyHasData && (
                                <Typography
                                    sx={{
                                        mt: 1.5,
                                        fontSize: 12,
                                        color: "#f59e0b",
                                    }}
                                >
                                    Not enough data yet
                                </Typography>
                            )}
                        </MetricCard>

                        {/* =================================================
                            TOOLS
                        ================================================== */}

                        <MetricCard
                            title="Tool Reliability"
                            weight="10%"
                            score={health.tools.score}
                            icon={
                                <BuildOutlinedIcon fontSize="small" />
                            }
                            description={
                                health.tools.total_calls > 0
                                    ? "Measures the success rate of AI tool calls."
                                    : "No tool calls were recorded in the selected period."
                            }
                        >
                            <DetailRow
                                label="Success Rate"
                                value={
                                    health.tools.success_rate !== null
                                        ? `${health.tools.success_rate}%`
                                        : "N/A"
                                }
                            />

                            <DetailRow
                                label="Total Calls"
                                value={health.tools.total_calls}
                            />

                            <DetailRow
                                label="Successful"
                                value={health.tools.successful_calls}
                            />

                            <DetailRow
                                label="Failed"
                                value={health.tools.failed_calls}
                            />
                        </MetricCard>
                    </Box>
                </Box>

                <Divider
                    sx={{
                        borderColor: "rgba(148, 163, 184, 0.10)",
                    }}
                />

                {/* =====================================================
                    CALCULATION INFORMATION
                ====================================================== */}

                <Box
                    sx={{
                        px: { xs: 2.5, md: 3 },
                        py: 2,
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: 2,
                            border: "1px solid rgba(59, 130, 246, 0.15)",
                            background:
                                "rgba(30, 64, 175, 0.08)",
                            p: 1.8,
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                        >
                            <ErrorOutlineIcon
                                sx={{
                                    color: "#60a5fa",
                                    fontSize: 21,
                                    mt: 0.1,
                                }}
                            />

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 15,
                                        fontWeight: 800,
                                        color: "#bfdbfe",
                                    }}
                                >
                                    How the score is calculated
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        color: "#94a3b8",
                                        lineHeight: 1.6,
                                        mt: 0.4,
                                    }}
                                >
                                    The AI Health Score combines Provider
                                    Availability (20%), Model Availability
                                    (15%), Inference Success (30%), Latency
                                    (25%) and Tool Reliability (10%).
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Box>

                {/* Footer */}

                <Box
                    sx={{
                        px: 3,
                        pb: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 12,
                            color: "#6f84a3",
                        }}
                    >
                        Metrics are calculated using AI activity from
                        the last 24 hours.
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}