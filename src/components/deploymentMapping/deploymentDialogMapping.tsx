import { useEffect, useState } from "react";
import type React from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { X, Plus, RefreshCw } from "lucide-react";
import Server from "../../service/Server";

export interface DeploymentTargetMapping {
    id: number;
    repository_id: number;
    repository_name?: string;
    workflow_id: number | string;
    workflow_name?: string;
    branch: string;
    cluster_id: number | string;
    cluster_name?: string;
    service_id: string;
    is_active: boolean;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onAddMapping: () => void;
}

const DeploymentMappingsDialog: React.FC<Props> = ({
    open,
    onClose,
    onAddMapping,
}) => {
    const [mappings, setMappings] = useState<DeploymentTargetMapping[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchMappings = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await Server.repository_deployment_targets();

            // Supports the project's API envelope and an Axios-wrapped response.
            const payload = response?.data?.data ?? response?.data ?? response?.items ?? [];
            console.log("payload", payload)
            const items = Array.isArray(payload)
                ? payload
                : payload?.items ?? [];

            if (!Array.isArray(items)) {
                throw new Error("Invalid deployment mappings response.");
            }

            setMappings(items);
        } catch (err: any) {
            setError(
                err?.message ?? "Failed to load deployment mappings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            void fetchMappings();
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            PaperProps={{
                sx: {
                    backgroundColor: "#0f172a",
                    color: "#e2e8f0",
                    border: "1px solid #263449",
                    borderRadius: 3,
                    backgroundImage: "none",
                    minHeight: "40%"
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    borderBottom: "1px solid #263449",
                    py: 2,
                }}
            >
                <Box>
                    <Typography variant="h6" fontWeight={800}>
                        Deployment Mappings
                    </Typography>

                    <Typography
                        sx={{ color: "#94a3b8", fontSize: 13, mt: 0.5 }}
                    >
                        Manage workflow deployment targets across your clusters.
                    </Typography>
                </Box>

                <IconButton
                    onClick={onClose}
                    aria-label="Close deployment mappings"
                    sx={{ color: "#94a3b8" }}
                >
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 2.5,
                    }}
                >
                    <Box>
                        <Typography fontWeight={700}>
                            Current mappings
                        </Typography>
                        <Typography
                            sx={{ color: "#94a3b8", fontSize: 12, mt: 0.5 }}
                        >
                            {mappings.length} target
                            {mappings.length === 1 ? "" : "s"} configured
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshCw size={16} />}
                            onClick={() => void fetchMappings()}
                            disabled={loading}
                            sx={{
                                textTransform: "none",
                                borderColor: "#334155",
                                color: "#cbd5e1",
                            }}
                        >
                            Refresh
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Plus size={17} />}
                            onClick={onAddMapping}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                backgroundColor: "#0e7490",
                                "&:hover": {
                                    backgroundColor: "#155e75",
                                },
                            }}
                        >
                            Add Mapping
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => void fetchMappings()}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 180,
                        }}
                    >
                        <CircularProgress size={30} />
                    </Box>
                ) : !error && mappings.length === 0 ? (
                    <Box
                        sx={{
                            minHeight: 220,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px dashed #334155",
                            borderRadius: 2,
                            textAlign: "center",
                            p: 3,
                        }}
                    >
                        <Typography fontWeight={700}>
                            No deployment mappings yet
                        </Typography>

                        <Typography
                            sx={{
                                color: "#94a3b8",
                                fontSize: 13,
                                mt: 1,
                                mb: 2,
                            }}
                        >
                            Connect a repository workflow and branch to one or
                            more Kubernetes services.
                        </Typography>

                        <Button
                            variant="outlined"
                            startIcon={<Plus size={16} />}
                            onClick={onAddMapping}
                            sx={{
                                textTransform: "none",
                                borderColor: "#0e7490",
                                color: "#7dd3fc",
                            }}
                        >
                            Create your first mapping
                        </Button>
                    </Box>
                ) : (
                    <TableContainer
                        sx={{
                            border: "1px solid #263449",
                            borderRadius: 2,
                            maxHeight: "55vh",
                        }}
                    >
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {[
                                        "Repository",
                                        "Workflow",
                                        "Branch",
                                        "Cluster",
                                        "Kubernetes service",
                                        "Status",
                                    ].map((heading) => (
                                        <TableCell
                                            key={heading}
                                            sx={{
                                                backgroundColor: "#111c30",
                                                color: "#94a3b8",
                                                borderColor: "#263449",
                                                fontWeight: 700,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {heading}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {mappings.map((mapping) => (
                                    <TableRow
                                        key={mapping.id}
                                        hover
                                        sx={{
                                            "&:hover": {
                                                backgroundColor:
                                                    "rgba(30, 41, 59, 0.45)",
                                            },
                                            "& td": {
                                                borderColor: "#263449",
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ color: "#e2e8f0" }}>
                                            {mapping.repository_name ??
                                                `Repository #${mapping.repository_id}`}
                                        </TableCell>

                                        <TableCell sx={{ color: "#cbd5e1" }}>
                                            {mapping.workflow_name ??
                                                `Workflow #${mapping.workflow_id}`}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={mapping.branch}
                                                sx={{
                                                    color: "#93c5fd",
                                                    backgroundColor:
                                                        "rgba(37, 99, 235, 0.15)",
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell sx={{ color: "#cbd5e1" }}>
                                            {mapping.cluster_name ??
                                                `Cluster #${mapping.cluster_id}`}
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                color: "#cbd5e1",
                                                fontFamily: "monospace",
                                                fontSize: 12,
                                            }}
                                        >
                                            {mapping.service_id}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={
                                                    mapping.is_active
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                                color={
                                                    mapping.is_active
                                                        ? "success"
                                                        : "default"
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DeploymentMappingsDialog;