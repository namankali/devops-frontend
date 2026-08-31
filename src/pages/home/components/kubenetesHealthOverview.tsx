import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    LinearProgress,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import type { KubernetesHealthData } from "../../../utils/types";
import { CustomSelect } from "../../../components/customSelect";
import { useState } from "react";

interface KubernetesOverviewProps {
    data: KubernetesHealthData
    selectedClusterName: string
    onClusterChange: any,
    handleClusterNameChange: any
}

export const KubernetesOverview: React.FC<KubernetesOverviewProps> = ({
    data,
    selectedClusterName,
    onClusterChange,
    handleClusterNameChange
}) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                background: "rgba(15,23,42,.8)",
                border: "1px solid #1e293b",
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: 0,
                    "&:last-child": {
                        pb: 2,
                    },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        flexShrink: 0,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={800}
                        >
                            Kubernetes Health Overview
                        </Typography>

                        <Typography
                            fontSize={15}
                            color="#64748b"
                            mt={0.3}
                        >
                            High-level infrastructure health
                        </Typography>
                    </Box>

                    <CustomSelect
                        value={selectedClusterName}
                        handleChange={handleClusterNameChange}
                        menuItems={data.registeredClusters}
                        label="Cluster"
                        purpose="cluster"
                    />

                    {/* <Chip
                        label={data.clusterName}
                        size="small"
                        sx={{
                            background:
                                data.clusterStatus === "Healthy"
                                    ? "rgba(34,197,94,.12)"
                                    : "rgba(239,68,68,.12)",
                            color:
                                data.clusterStatus === "Healthy"
                                    ? "#22c55e"
                                    : "#ef4444",
                            border:
                                data.clusterStatus === "Healthy"
                                    ? "1px solid rgba(34,197,94,.25)"
                                    : "1px solid rgba(239,68,68,.25)",
                            fontWeight: 700,
                            fontSize: 13,
                        }}
                    /> */}
                </Box>

                {/* =====================================================
                    HEALTH SUMMARY
                ====================================================== */}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr 1fr",
                            sm: "repeat(4, 1fr)",
                        },
                        gap: 1.5,
                        mb: 2,
                    }}
                >
                    {/* Node Readiness */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: "rgba(15,23,42,.9)",
                            border: "1px solid #1e293b",
                        }}
                    >
                        <Typography
                            fontSize={14}
                            color="#94a3b8"
                            mb={0.5}
                        >
                            Node Readiness
                        </Typography>

                        <Typography
                            fontSize={23}
                            fontWeight={800}
                        >
                            {data.nodeReadiness?.percentage}%
                        </Typography>

                        <Typography
                            fontSize={13}
                            color={
                                data.nodeReadiness?.percentage >= 90
                                    ? "#22c55e"
                                    : "#f59e0b"
                            }
                            mt={0.3}
                        >
                            {data.nodeReadiness?.label}
                        </Typography>
                    </Box>

                    {/* Workload Stability */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: "rgba(15,23,42,.9)",
                            border: "1px solid #1e293b",
                        }}
                    >
                        <Typography
                            fontSize={14}
                            color="#94a3b8"
                            mb={0.5}
                        >
                            Workload Stability
                        </Typography>

                        <Typography
                            fontSize={23}
                            fontWeight={800}
                        >
                            {data.workloadStability?.percentage}%
                        </Typography>

                        <Typography
                            fontSize={13}
                            color={
                                data.workloadStability?.percentage >= 90
                                    ? "#22c55e"
                                    : "#f59e0b"
                            }
                            mt={0.3}
                        >
                            {data.workloadStability?.label}
                        </Typography>
                    </Box>

                    {/* Deployments */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: "rgba(15,23,42,.9)",
                            border: "1px solid #1e293b",
                        }}
                    >
                        <Typography
                            fontSize={14}
                            color="#94a3b8"
                            mb={0.5}
                        >
                            Deployments
                        </Typography>

                        <Typography
                            fontSize={23}
                            fontWeight={800}
                        >
                            {data.deployments.total}
                        </Typography>

                        <Typography
                            fontSize={13}
                            color="#22c55e"
                            mt={0.3}
                        >
                            {data.deployments.label}
                        </Typography>
                    </Box>

                    {/* Attention */}
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: "rgba(15,23,42,.9)",
                            border: "1px solid #1e293b",
                        }}
                    >
                        <Typography
                            fontSize={14}
                            color="#94a3b8"
                            mb={0.5}
                        >
                            Attention
                        </Typography>

                        <Typography
                            fontSize={23}
                            fontWeight={800}
                        >
                            {data.attention.count}
                        </Typography>

                        <Typography
                            fontSize={13}
                            color={
                                data.attention.count === 0
                                    ? "#22c55e"
                                    : "#f59e0b"
                            }
                            mt={0.3}
                        >
                            {data.attention.label}
                        </Typography>
                    </Box>
                </Box>

                {/* =====================================================
                    LOWER SECTION
                ====================================================== */}

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1.2fr 1fr",
                        },
                        gap: 2,
                    }}
                >
                    {/* Workload Stability */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background: "rgba(15,23,42,.9)",
                            border: "1px solid #1e293b",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box>
                            <Typography
                                fontSize={16}
                                fontWeight={700}
                                mb={0.5}
                            >
                                Workload Stability
                            </Typography>

                            <Typography
                                fontSize={14}
                                color="#7a899e"
                            >
                                Current cluster workload condition
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 0.7,
                                }}
                            >
                                <Typography
                                    fontSize={15}
                                    color="#919fb4"
                                >
                                    Stable workloads
                                </Typography>

                                <Typography
                                    fontSize={14}
                                    fontWeight={700}
                                >
                                    {data.workloadStability.percentage}%
                                </Typography>
                            </Box>

                            <LinearProgress
                                variant="determinate"
                                value={data.workloadStability.percentage}
                                sx={{
                                    height: 7,
                                    borderRadius: 99,
                                    background: "#1e293b",
                                    "& .MuiLinearProgress-bar": {
                                        borderRadius: 99,
                                        background:
                                            data.workloadStability.percentage >= 90
                                                ? "#22c55e"
                                                : "#f59e0b",
                                    },
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <Box>
                                <Typography
                                    fontSize={14}
                                    color="#64748b"
                                >
                                    Running
                                </Typography>

                                <Typography
                                    fontSize={18}
                                    fontWeight={800}
                                >
                                    {data.workloadStability.running}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    fontSize={14}
                                    color="#64748b"
                                >
                                    Unhealthy
                                </Typography>

                                <Typography
                                    fontSize={18}
                                    fontWeight={800}
                                    color={
                                        data.workloadStability.unhealthy === 0
                                            ? "#22c55e"
                                            : "#ef4444"
                                    }
                                >
                                    {data.workloadStability.unhealthy}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    fontSize={14}
                                    color="#64748b"
                                >
                                    Restarts
                                </Typography>

                                <Typography
                                    fontSize={18}
                                    fontWeight={800}
                                >
                                    {data.workloadStability.restarts}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Cluster Signals */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background: "rgba(15,23,42,.9)",
                            border: "1px solid #1e293b",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography
                            fontSize={16}
                            fontWeight={700}
                            mb={1.5}
                        >
                            Cluster Signals
                        </Typography>

                        {data.signals.map((signal, index) => {
                            const isHealthy =
                                signal.status === "Healthy" ||
                                signal.status === "Stable" ||
                                signal.status === "Operational"

                            return (
                                <Box
                                    key={signal.name}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        py: 1,
                                        borderBottom:
                                            index !== data.signals.length - 1
                                                ? "1px solid #1e293b"
                                                : "none",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: "50%",
                                                background: isHealthy
                                                    ? "#22c55e"
                                                    : "#ef4444",
                                            }}
                                        />

                                        <Typography fontSize={15}>
                                            {signal.name}
                                        </Typography>
                                    </Box>

                                    <Typography
                                        fontSize={14}
                                        color={
                                            isHealthy
                                                ? "#22c55e"
                                                : "#ef4444"
                                        }
                                        fontWeight={700}
                                    >
                                        {signal.value}
                                    </Typography>
                                </Box>
                            )
                        })}

                        {/* Footer */}
                        <Box
                            sx={{
                                mt: "auto",
                                pt: 1.5,
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Typography
                                fontSize={14}
                                color="#06b6d4"
                                fontWeight={700}
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },
                                }}
                                onClick={() => navigate("/kubernetes")}
                            >
                                View Kubernetes details →
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}