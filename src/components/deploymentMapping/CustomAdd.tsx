import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { Plus, Trash2, X } from "lucide-react";
import Server from "../../service/Server";

interface BranchOption {
    name: string;
}

interface WorkflowOption {
    workflow_id: number | string;
    name: string;
    path: string;
    state?: string;
    html_url?: string;
}

interface RepositoryOption {
    repository_id: number;
    github_repo_id: string;
    repo_name: string;
    repo_fullname: string;
    default_branch?: string;
    is_private?: boolean;
    branches: BranchOption[];
    workflows: WorkflowOption[];
}

interface KubernetesServiceOption {
    service_id: string;
    service_name: string;
    namespace: string;
    active: boolean;
    created_at?: string | Date;
}

interface ClusterOption {
    cluster_id: number;
    display_name: string;
    environment: string;
    provider?: string;
    services: KubernetesServiceOption[];
    services_loaded?: boolean;
}

interface DeploymentMappingFormData {
    repositories: RepositoryOption[];
    clusters: ClusterOption[];
    existing_mappings: any[];
}

interface DeploymentTargetInput {
    cluster_id: string;
    service_id: string;
}

export interface CreateDeploymentMappingPayload {
    repository_id: number;
    workflow_id: number;
    branch: string;
    targets: {
        cluster_id: number;
        service_id: string;
    }[];
}

interface AddDeploymentMappingDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (
        payload: CreateDeploymentMappingPayload
    ) => Promise<void> | void;
}

const emptyTarget = (): DeploymentTargetInput => ({
    cluster_id: "",
    service_id: "",
});

const AddDeploymentMappingDialog = ({
    open,
    onClose,
    onSave,
}: AddDeploymentMappingDialogProps) => {
    const [formData, setFormData] =
        useState<DeploymentMappingFormData>({
            repositories: [],
            clusters: [],
            existing_mappings: [],
        });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [saveError, setSaveError] = useState("");

    const [repositoryId, setRepositoryId] = useState("");
    const [workflowId, setWorkflowId] = useState("");
    const [branch, setBranch] = useState("");
    const [targets, setTargets] =
        useState<DeploymentTargetInput[]>([emptyTarget()]);

    // Fetch repository, workflow, branch, cluster, and service options
    // whenever the dialog opens.
    useEffect(() => {
        if (!open) return;

        let cancelled = false;

        const loadFormData = async () => {
            setLoading(true);
            setLoadError("");
            setSaveError("");

            try {
                const response = await Server.repository_deployment_targets_default_data();

                const body =
                    response?.data?.repositories
                        ? response.data
                        : response?.repositories
                            ? response
                            : response?.data?.data?.repositories
                                ? response.data.data
                                : null;

                if (!body) {
                    throw new Error(
                        response?.message ||
                        "The deployment mapping options could not be loaded."
                    );
                }

                if (cancelled) return;

                setFormData({
                    repositories: body.repositories ?? [],
                    clusters: body.clusters ?? [],
                    existing_mappings: body.existing_mappings ?? [],
                });
            } catch (error: any) {
                if (cancelled) return;

                setLoadError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load deployment mapping options."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadFormData();

        return () => {
            cancelled = true;
        };
    }, [open]);

    const selectedRepository = useMemo(() => formData.repositories.find(
        (repo) => String(repo.repository_id) === repositoryId
    ),
        [formData.repositories, repositoryId]
    );

    const selectedClusterByTarget = (clusterId: string) =>
        formData.clusters.find(
            (cluster) => String(cluster.cluster_id) === clusterId
        );

    const availableBranches = useMemo(() => {
        if (!selectedRepository) return [];

        const branches = selectedRepository.branches ?? [];
        const branchNames = new Set(branches.map((item) => item.name));

        // Keep the default branch available even if the branches array
        // returned by the API does not contain it for some reason.
        if (
            selectedRepository.default_branch &&
            !branchNames.has(selectedRepository.default_branch)
        ) {
            return [
                ...branches,
                { name: selectedRepository.default_branch },
            ];
        }

        return branches;
    }, [selectedRepository]);

    const updateTarget = (
        index: number,
        field: keyof DeploymentTargetInput,
        value: string
    ) => {
        setTargets((current) =>
            current.map((target, targetIndex) => {
                if (targetIndex !== index) return target;

                // Clear the old service selection when the cluster changes.
                if (field === "cluster_id") {
                    return {
                        cluster_id: value,
                        service_id: "",
                    };
                }

                return {
                    ...target,
                    [field]: value,
                };
            })
        );
    };

    const resetForm = () => {
        setRepositoryId("");
        setWorkflowId("");
        setBranch("");
        setTargets([emptyTarget()]);
        setSaveError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleRepositoryChange = (
        event: SelectChangeEvent<string>
    ) => {
        const nextRepositoryId = event.target.value;

        setRepositoryId(nextRepositoryId);
        setWorkflowId("");
        setBranch("");
    };

    const handleSubmit = async () => {
        setSaveError("");

        if (!repositoryId || !workflowId || !branch) {
            setSaveError(
                "Select a repository, workflow, and branch."
            );
            return;
        }

        if (
            targets.length === 0 ||
            targets.some(
                (target) =>
                    !target.cluster_id || !target.service_id
            )
        ) {
            setSaveError(
                "Select a cluster and service for every deployment target."
            );
            return;
        }

        const payload: CreateDeploymentMappingPayload = {
            repository_id: Number(repositoryId),
            workflow_id: Number(workflowId),
            branch,
            targets: targets.map((target) => ({
                cluster_id: Number(target.cluster_id),
                service_id: target.service_id,
            })),
        };

        setSaving(true);

        try {
            await onSave(payload);
            handleClose();
        } catch (error: any) {
            setSaveError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to submit the deployment mapping."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
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
                }}
            >
                Add Deployment Mapping

                <IconButton
                    onClick={handleClose}
                    aria-label="Close dialog"
                    size="small"
                >
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ py: 6 }}
                    >
                        <CircularProgress />
                        <Typography variant="body2" color="text.secondary">
                            Loading repositories, workflows, clusters, and
                            Kubernetes services...
                        </Typography>
                    </Stack>
                ) : (
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        {loadError && (
                            <Alert severity="error">
                                {loadError}
                            </Alert>
                        )}

                        {saveError && (
                            <Alert severity="error">
                                {saveError}
                            </Alert>
                        )}

                        {!loadError && (
                            <>
                                {/* Repository */}
                                <FormControl fullWidth required>
                                    <InputLabel id="repository-label">
                                        Repository
                                    </InputLabel>

                                    <Select
                                        labelId="repository-label"
                                        label="Repository"
                                        value={repositoryId}
                                        onChange={handleRepositoryChange}
                                    >
                                        {formData.repositories.map((repo) => (
                                            <MenuItem
                                                key={repo.repository_id}
                                                value={String(repo.repository_id)}
                                            >
                                                {repo.repo_fullname}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    {formData.repositories.length === 0 && (
                                        <FormHelperText>
                                            No repositories are available.
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                {/* Workflow */}
                                <FormControl
                                    fullWidth
                                    required
                                    disabled={!selectedRepository}
                                >
                                    <InputLabel id="workflow-label">
                                        Workflow
                                    </InputLabel>

                                    <Select
                                        labelId="workflow-label"
                                        label="Workflow"
                                        value={workflowId}
                                        onChange={(event) => {
                                            setWorkflowId(event.target.value);
                                        }}
                                    >
                                        {(selectedRepository?.workflows ?? []).map(
                                            (workflow) => (
                                                <MenuItem
                                                    key={workflow.workflow_id}
                                                    value={String(
                                                        workflow.workflow_id
                                                    )}
                                                >
                                                    {workflow.name}{" "}
                                                    {workflow.state
                                                        ? `(${workflow.state})`
                                                        : ""}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>

                                    {selectedRepository &&
                                        selectedRepository.workflows.length ===
                                        0 && (
                                            <FormHelperText>
                                                No workflows found for this
                                                repository.
                                            </FormHelperText>
                                        )}
                                </FormControl>

                                {/* Branch */}
                                <FormControl
                                    fullWidth
                                    required
                                    disabled={!selectedRepository}
                                >
                                    <InputLabel id="branch-label">
                                        Branch
                                    </InputLabel>

                                    <Select
                                        labelId="branch-label"
                                        label="Branch"
                                        value={branch}
                                        onChange={(event) => {
                                            setBranch(event.target.value);
                                        }}
                                    >
                                        {availableBranches.map((item) => (
                                            <MenuItem
                                                key={item.name}
                                                value={item.name}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    {selectedRepository &&
                                        availableBranches.length === 0 && (
                                            <FormHelperText>
                                                No branches found for this
                                                repository.
                                            </FormHelperText>
                                        )}
                                </FormControl>

                                {/* Deployment targets */}
                                <Box>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ mb: 2 }}
                                    >
                                        <Box>
                                            <Typography variant="subtitle1">
                                                Deployment Targets
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Choose the cluster and
                                                Kubernetes service this workflow
                                                deploys to.
                                            </Typography>
                                        </Box>

                                        <Button
                                            startIcon={<Plus size={16} />}
                                            onClick={() =>
                                                setTargets((current) => [
                                                    ...current,
                                                    emptyTarget(),
                                                ])
                                            }
                                            disabled={formData.clusters.length === 0}
                                        >
                                            Add target
                                        </Button>
                                    </Stack>

                                    <Stack spacing={2}>
                                        {targets.map((target, index) => {
                                            const selectedCluster =
                                                selectedClusterByTarget(
                                                    target.cluster_id
                                                );

                                            const services =
                                                selectedCluster?.services ?? [];

                                            return (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: "grid",
                                                        gridTemplateColumns: {
                                                            xs: "1fr",
                                                            sm: "1fr 1fr auto",
                                                        },
                                                        gap: 2,
                                                        alignItems: "start",
                                                        p: 2,
                                                        border: 1,
                                                        borderColor: "divider",
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    {/* Cluster */}
                                                    <FormControl fullWidth required>
                                                        <InputLabel
                                                            id={`cluster-label-${index}`}
                                                        >
                                                            Cluster
                                                        </InputLabel>

                                                        <Select
                                                            labelId={`cluster-label-${index}`}
                                                            label="Cluster"
                                                            value={target.cluster_id}
                                                            onChange={(event) =>
                                                                updateTarget(
                                                                    index,
                                                                    "cluster_id",
                                                                    event.target.value
                                                                )
                                                            }
                                                        >
                                                            {formData.clusters.map(
                                                                (cluster) => (
                                                                    <MenuItem
                                                                        key={
                                                                            cluster.cluster_id
                                                                        }
                                                                        value={String(
                                                                            cluster.cluster_id
                                                                        )}
                                                                    >
                                                                        {cluster.display_name}
                                                                        {" — "}
                                                                        {cluster.environment}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>
                                                    </FormControl>

                                                    {/* Kubernetes service */}
                                                    <FormControl
                                                        fullWidth
                                                        required
                                                        disabled={
                                                            !target.cluster_id ||
                                                            selectedCluster?.services_loaded ===
                                                            false
                                                        }
                                                    >
                                                        <InputLabel
                                                            id={`service-label-${index}`}
                                                        >
                                                            Kubernetes Service
                                                        </InputLabel>

                                                        <Select
                                                            labelId={`service-label-${index}`}
                                                            label="Kubernetes Service"
                                                            value={target.service_id}
                                                            onChange={(event) =>
                                                                updateTarget(
                                                                    index,
                                                                    "service_id",
                                                                    event.target.value
                                                                )
                                                            }
                                                        >
                                                            {services.map(
                                                                (service) => (
                                                                    <MenuItem
                                                                        key={
                                                                            service.service_id
                                                                        }
                                                                        value={
                                                                            service.service_id
                                                                        }
                                                                    >
                                                                        {service.service_name}
                                                                        {" ("}
                                                                        {service.namespace}
                                                                        {")"}
                                                                        {!service.active
                                                                            ? " — Inactive"
                                                                            : ""}
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </Select>

                                                        {target.cluster_id &&
                                                            selectedCluster?.services_loaded ===
                                                            false && (
                                                                <FormHelperText error>
                                                                    Services could not
                                                                    be loaded for this
                                                                    cluster.
                                                                </FormHelperText>
                                                            )}

                                                        {selectedCluster?.services_loaded !==
                                                            false &&
                                                            target.cluster_id &&
                                                            services.length === 0 && (
                                                                <FormHelperText>
                                                                    No Kubernetes
                                                                    services found.
                                                                </FormHelperText>
                                                            )}
                                                    </FormControl>

                                                    <IconButton
                                                        aria-label="Remove deployment target"
                                                        color="error"
                                                        disabled={
                                                            targets.length === 1
                                                        }
                                                        onClick={() =>
                                                            setTargets((current) =>
                                                                current.filter(
                                                                    (_, i) =>
                                                                        i !== index
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={18} />
                                                    </IconButton>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </Box>
                            </>
                        )}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} disabled={saving}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || saving || Boolean(loadError)}
                >
                    {saving ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        "Save Mapping"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDeploymentMappingDialog;