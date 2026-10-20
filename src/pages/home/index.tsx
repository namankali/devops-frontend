import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Card,
    CardContent,
    Grid,
    Chip,
    TextField,
    InputAdornment,
    LinearProgress,
    Skeleton,
    useTheme,
} from "@mui/material";
import {
    Search,
    GitPullRequest,
    AlertTriangle,
    Rocket,
    Shield,
    FolderGit2,
    Bot,
    CircleX,
    CircleCheck,
    ShieldAlert,
    Network,
    X,
} from "lucide-react";

import { useRepoDetailsCount } from "../../hooks/userRepoDetailsCount";
import RepoDetailsDialog from "./components/totalReposDialog";
import Server from "../../service/Server";
import AIHealthScoreDialog from "./components/aiHealthScore";
import { KubernetesOverview } from "./components/kubenetesHealthOverview";
import type { KubernetesHealthData } from "../../utils/types";
import { KubernetesStore } from "../../helper/useKubernetesStore";
import { useKubernetesDashboard } from "../../hooks/useKubernetesDashboard";
import { useDashboardSummary } from "../../hooks/useDashboardSummary";
import { formatDuration, formatRelativeTime } from "../../helper/format";
import type { DashboardActivityEvent } from "../../helper/interfaces";
import IncidentImpactMap from "./components/IncidentImpactMap";
const DASHBOARD_HEADER_HEIGHT = 76;

const kubernetesHealthInitailData: KubernetesHealthData = {
    "clusterName": '',
    clusterStatus: "",
    clusterId: "",
    "registeredClusters": [],

    nodeReadiness: {
        percentage: 0,
        ready: 0,
        total: 0,
        label: "0 / 0 ready",
    },

    workloadStability: {
        percentage: 0,
        running: 0,
        unhealthy: 0,
        restarts: 0,
        label: "No failed workloads",
    },

    deployments: {
        total: 0,
        label: "Operational",
    },

    attention: {
        count: 0,
        label: "No critical issues",
    },

    signals: [
        {
            name: "Nodes",
            status: "Healthy",
            value: "0 / 0 Ready",
        },
        {
            name: "Workloads",
            status: "Stable",
            value: "0 Running",
        },
        {
            name: "Cluster Availability",
            status: "Healthy",
            value: "",
        },
    ],
}

const stats = [
    {
        title: "Total Repos",
        value: "0",
        change: "↑ 2 from yesterday",
        icon: FolderGit2,
        color: "#00d5ff",
    },
    {
        title: "Open PRs",
        value: "0",
        change: "↑ 3 from yesterday",
        icon: GitPullRequest,
        color: "#8b5cf6",
    },
    {
        title: "Failed Builds",
        value: "0",
        change: "↓ 1 from yesterday",
        icon: CircleX,
        color: "#ef4444",
    },
    {
        title: "Security Alerts",
        value: "1",
        change: "↑ 0 from yesterday",
        icon: Shield,
        color: "#f59e0b",
    },
    {
        title: "Deployments",
        value: "8",
        change: "↑ 1 from yesterday",
        icon: Rocket,
        color: "#06b6d4",
    },
    {
        title: "AI Health Score",
        value: "82",
        suffix: "/100",
        change: "Based on last 24 hours",
        icon: Bot,
        color: "#8b5cf6",
        progress: 82,
    },
];

// const insights = [
//     {
//         icon: AlertTriangle,
//         title: "ai-devops-api has failed 3 builds in the last 24 hours.",
//         action: "View Details",
//         color: "#ef4444",
//     },
//     {
//         icon: GitPullRequest,
//         title: "devops-frontend has 4 open PRs waiting for review.",
//         action: "View PRs",
//         color: "#8b5cf6",
//     },
//     {
//         icon: AlertTriangle,
//         title: "Suspicious login attempts detected in auth-service logs.",
//         action: "View Logs",
//         color: "#f59e0b",
//     },
// ];

// const activities = [
//     {
//         icon: GitPullRequest,
//         title: "PR #42 opened in devops-frontend",
//         desc: "Add dark mode support",
//         time: "10m ago",
//         color: "#8b5cf6",
//     },
//     {
//         icon: CircleX,
//         title: "Build #105 failed in ai-devops-api",
//         desc: "Unit tests failed",
//         time: "15hrs ago",
//         color: "#ef4444",
//     },
//     {
//         icon: CircleCheck,
//         title: "Build #104 succeeded in auth-service",
//         desc: "Main branch",
//         time: "5 days ago",
//         color: "#22c55e",
//     },
//     {
//         icon: Rocket,
//         title: "Deployment started for auth-service",
//         desc: "Staging environment",
//         time: "35m ago",
//         color: "#06b6d4",
//     },
//     {
//         icon: Shield,
//         title: "Security alert in auth-service",
//         desc: "Unusual login activity detected",
//         time: "2 days ago",
//         color: "#f59e0b",
//     },
// ];

interface RepoDetails {
    name: string;
    type: string;
    owner: string;
    branch: string;
    build: string;
    prs: number;
    deploy: string;
    security: string;
    activity: string;
}

const getStatusColor = (
    status: string
): "success" | "error" | "warning" | "info" | "default" => {
    const normalizedStatus = status?.trim().toLowerCase();

    switch (normalizedStatus) {
        case "success":
        case "successful":
        case "low":
            return "success";

        case "failed":
        case "failure":
        case "high":
            return "error";

        case "running":
        case "medium":
            return "warning";

        case "in progress":
        case "in-progress":
            return "info";

        default:
            return "default";
    }
};

const Home: React.FC = () => {
    const theme = useTheme()
    const [selectedClusterName, setSelectedClusterName] = useState("");
    const { data: rows, isLoading } = useRepoDetailsCount();
    const { data: dashboardSummaryData } = useDashboardSummary()
    console.log("dashboardSummaryData", dashboardSummaryData)
    const {
        data: kubDashboardData,
        isLoading: defaultKubeDashboardLoading
    } = useKubernetesDashboard(selectedClusterName)

    const { selectedDisplayName, setSelectedDisplayName } = KubernetesStore()

    const [repoDialogOpen, setRepoDialogOpen] = useState(false);
    const [aiHealthDialogOpen, setAiHealthDialogOpen] = useState(false);
    const [impactDialogOpen, setImpactDialogOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
    const [selectedSourceServiceId, setSelectedSourceServiceId] = useState<string | null>(null);
    const [selectedSourceLabel, setSelectedSourceLabel] = useState("");
    const [repoDetails, setRepoDetails] = useState<RepoDetails[]>([]);
    const [repoSearch, setRepoSearch] = useState("");

    const metrics = dashboardSummaryData?.ai_insights?.metrics;

    const percentileRows = [
        { label: "P50", rank: 50, value: metrics?.p50 },
        { label: "P70", rank: 70, value: metrics?.p70 },
        { label: "P90", rank: 90, value: metrics?.p90 },
        { label: "P95", rank: 95, value: metrics?.p95 },
        { label: "P99", rank: 99, value: metrics?.p99 },
    ];

    const incidents = dashboardSummaryData?.incidents?.items ?? [];
    const incidentCount =
        dashboardSummaryData?.incidents?.queue_count ?? incidents.length;
    const pipelineCards = dashboardSummaryData?.ai_insights?.cards ?? {};

    const insights = useMemo(() => {
        const pipelineCards = dashboardSummaryData?.ai_insights?.cards ?? {}

        const pipelineInsights = Object.entries(pipelineCards).map(([pipeline_id, pipeline]: [string, any]) => {
            const status = pipeline?.status?.toLowerCase();
            const isFailure = status === "failure" || status === "failed";
            const isSuccess = status === "success";

            return {
                id: pipeline_id,
                icon: isFailure ? AlertTriangle : isSuccess ? CircleCheck : CircleX,
                title: isFailure
                    ? `${pipeline.repository} pipeline failed${pipeline.consecutive_failures > 1 ? `(${pipeline.consecutive_failures} consecutive failures)` : ""}.`
                    : isSuccess
                        ? `${pipeline.repository} pipeline run #${pipeline.latest_run_number} succeeded.`
                        : `${pipeline.repository} pipeline status: ${pipeline.status}.`,
                action: pipeline.html_url
                    ? "View Workflow"
                    : "Pipeline Details",
                color: isFailure
                    ? "#ef4444"
                    : isSuccess
                        ? "#22c55e"
                        : "#f59e0b",
                url: pipeline.html_url,
            }
        })

        return pipelineInsights
    }, [dashboardSummaryData])

    const activities = useMemo(() => {
        const items = dashboardSummaryData?.recent_activity?.items ?? [];

        // Remove duplicate events and sort newest first.
        const uniqueItems = [
            ...new Map(
                items.map((item: DashboardActivityEvent) => [
                    item.event_id,
                    item,
                ])
            ).values(),
        ];

        return uniqueItems
            .sort(
                (a: any, b: any) => b.timestamp - a.timestamp
            )
            .slice(0, 10)
            .map((event: DashboardActivityEvent) => {
                const status = event.status.toLowerCase();

                const isFailure = status === "failure" || status === "failed" || event.event_type === "build_failure";

                const isSuccess = status === "success" || status === "successful" || event.event_type === "build_success";

                const Icon = isFailure ? CircleX : isSuccess ? CircleCheck : AlertTriangle;

                const color = isFailure ? "#ef4444" : isSuccess ? "#22c55e" : "#f59e0b";

                const shortRepo = event.repository.split("/").pop() ?? event.repository;

                const outcome = isFailure ? "failed" : isSuccess ? "succeeded" : status;

                const description = [
                    event.branch,
                    event.duration != null ? `Duration: ${formatDuration(event.duration)}` : null,
                ]
                    .filter(Boolean)
                    .join(" · ");

                return {
                    id: event.event_id,
                    icon: Icon,
                    title: `Build #${event.run_number} ${outcome} in ${shortRepo}`,
                    desc: description || `Workflow run ${event.run_id}`,
                    time: formatRelativeTime(event.timestamp),
                    color,
                    url: event.html_url,
                };
            });
    }, [dashboardSummaryData])

    const handleClusterNameChange = (e: any) => {
        const clusterName = e.target.value;

        setSelectedClusterName(clusterName);
        setSelectedDisplayName(clusterName);

        console.log("Selected cluster:", clusterName);

    }

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const fetchRes = await Server.dashboard_repo_details();

                if (mounted) {
                    setRepoDetails(fetchRes.data ?? []);
                }
            } catch (error) {
                console.error("Failed to fetch repo details", error);

                if (mounted) {
                    setRepoDetails([]);
                }
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, []);

    const countData = useMemo(() => {
        return stats.map((item) => {
            if (item.title === "Total Repos") {
                return {
                    ...item,
                    value: String(rows?.repo_count ?? 0),
                };
            }

            if (item.title === "Open PRs") {
                return {
                    ...item,
                    value: String(rows?.open_prs ?? 0),
                };
            }

            if (item.title === "Failed Builds") {
                return {
                    ...item,
                    value: String(rows?.failed_workflow_run_count ?? 0),
                };
            }

            if (item.title === "Deployments") {
                return {
                    ...item,
                    value: String(rows?.deployments ?? 0),
                };
            }

            if (item.title === "AI Health Score") {
                return {
                    ...item,
                    value: String(rows?.ai_health_score ?? 0),
                    progress: Number(rows?.ai_health_score ?? 0)
                }
            }


            return item;
        });
    }, [rows]);

    useEffect(() => {
        const clusterName = kubDashboardData?.clusterName;

        if (clusterName) {
            setSelectedDisplayName(clusterName);
        }
    }, [kubDashboardData?.clusterName]);

    const filteredRepoDetails = useMemo(() => {
        const query = repoSearch.trim().toLowerCase();

        if (!query) {
            return repoDetails;
        }

        return repoDetails.filter((repo) =>
            [
                repo.name,
                repo.type,
                repo.owner,
                repo.branch,
                repo.build,
                repo.deploy,
                repo.security,
                repo.activity,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(query)
                )
        );
    }, [repoDetails, repoSearch]);

    if (isLoading || defaultKubeDashboardLoading) {
        return (
            <Box
                sx={{
                    minHeight: `calc(100dvh - ${DASHBOARD_HEADER_HEIGHT}px)`,
                    p: { xs: 2, md: 3 },
                    background:
                        "radial-gradient(circle at top left, #10233f 0%, #07111f 38%, #050b14 100%)",
                }}
            >
                <Skeleton
                    variant="rounded"
                    height={120}
                    sx={{ mb: 2 }}
                />

                <Skeleton
                    variant="rounded"
                    height={500}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                // minHeight: `calc(100dvh - ${DASHBOARD_HEADER_HEIGHT}px)`,
                // height: `calc(100dvh - ${DASHBOARD_HEADER_HEIGHT}px)`,
                // boxSizing: "border-box",
                height: "100%",
                minHeight: 0,
                boxSizing: "border-box",
                color: "#e5e7eb",

                background:
                    "radial-gradient(circle at top left, #10233f 0%, #07111f 38%, #050b14 100%)",

                p: { xs: 2, md: 3 },

                display: "flex",
                flexDirection: "column",

                overflow: "hidden",
            }}
        >
            {/* =========================================================
                STATS
            ========================================================== */}

            <Grid
                container
                spacing={2}
                sx={{
                    flexShrink: 0,
                    mb: 2,
                }}
            >
                {countData.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4,
                                lg: 2,
                            }}
                            key={item.title}
                        >
                            <Card
                                onClick={() => {
                                    if (item.title === "Total Repos") {
                                        setRepoDialogOpen(true);
                                    }
                                    if (item.title === "AI Health Score") {
                                        setAiHealthDialogOpen(true)
                                    }
                                }}
                                sx={{
                                    height: "100%",
                                    minHeight: 98,

                                    background:
                                        "rgba(15, 23, 42, 0.8)",

                                    border: "1px solid #1e293b",

                                    color: "#e5e7eb",

                                    borderRadius: 3,

                                    cursor:
                                        item.title === "Total Repos"
                                            ? "pointer"
                                            : "default",

                                    transition:
                                        "border-color 0.2s ease, transform 0.2s ease",

                                    "&:hover":
                                        item.title === "Total Repos"
                                            ? {
                                                borderColor: "#00d5ff",
                                                transform:
                                                    "translateY(-2px)",
                                            }
                                            : {},
                                }}
                            >
                                <CardContent
                                    sx={{
                                        "&:last-child": {
                                            pb: 2,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1.5,
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                flexShrink: 0,

                                                borderRadius: 2,

                                                display: "grid",
                                                placeItems: "center",

                                                background: `${item.color}22`,
                                                color: item.color,
                                            }}
                                        >
                                            <Icon size={25} />
                                        </Box>

                                        <Box
                                            sx={{
                                                minWidth: 0,
                                            }}
                                        >
                                            <Typography
                                                color="#94a3b8"
                                                fontSize={13}
                                                noWrap
                                            >
                                                {item.title}
                                            </Typography>

                                            <Typography
                                                variant="h4"
                                                fontWeight={800}
                                                lineHeight={1.1}
                                            >
                                                {item.value}

                                                {"suffix" in item &&
                                                    item.suffix && (
                                                        <Typography
                                                            component="span"
                                                            color="#94a3b8"
                                                            fontSize={17}
                                                            ml={0.5}
                                                        >
                                                            {item.suffix}
                                                        </Typography>
                                                    )}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography
                                        color="#22c55e"
                                        fontSize={12}
                                        mt={1}
                                    >
                                        {item.change}
                                    </Typography>

                                    {"progress" in item &&
                                        item.progress !== undefined && (
                                            <LinearProgress
                                                variant="determinate"
                                                value={item.progress}
                                                sx={{
                                                    mt: 1.2,
                                                    height: 5,
                                                    borderRadius: 99,
                                                }}
                                            />
                                        )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* =========================================================
                MAIN DASHBOARD AREA

                This section deliberately takes the remaining viewport
                height. This is what removes the large unused space.
            ========================================================== */}

            <Grid
                container
                spacing={2}
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                {/* =====================================================
                    LEFT COLUMN
                ====================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 8,
                    }}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        minHeight: 0,
                    }}
                >
                    {/* =================================================
                        REPOSITORY ACTIVITY
                    ================================================== */}

                    <KubernetesOverview
                        data={kubDashboardData ?? kubernetesHealthInitailData}
                        selectedClusterName={selectedDisplayName}
                        onClusterChange={setSelectedDisplayName}
                        handleClusterNameChange={handleClusterNameChange}
                    />

                    {/* =================================================
                        REPOSITORY OVERVIEW
                    ================================================== */}

                    <Card
                        sx={{
                            // flexShrink: 0,
                            flex: 1,
                            background:
                                "rgba(15, 23, 42, 0.8)",

                            border: "1px solid #1e293b",

                            color: "#e5e7eb",

                            borderRadius: 3,

                            minHeight: 280,

                            display: "flex",
                            flexDirection: "column",

                            overflow: "hidden",
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",

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
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",

                                    gap: 2,

                                    mb: 2,

                                    flexWrap: "wrap",

                                    flexShrink: 0,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={800}
                                >
                                    Repository Overview
                                </Typography>

                                <TextField
                                    size="small"
                                    value={repoSearch}
                                    onChange={(event) =>
                                        setRepoSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search repositories..."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search
                                                    size={17}
                                                    color="#94a3b8"
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        width: {
                                            xs: "100%",
                                            sm: 230,
                                        },

                                        input: {
                                            color: "#e5e7eb",
                                        },

                                        "& input::placeholder": {
                                            color: "#64748b",
                                            opacity: 1,
                                        },

                                        "& fieldset": {
                                            borderColor:
                                                "#1e293b",
                                        },

                                        "&:hover fieldset": {
                                            borderColor:
                                                "#334155",
                                        },

                                        "&.Mui-focused fieldset":
                                        {
                                            borderColor:
                                                "#00d5ff",
                                        },
                                    }}
                                />
                            </Box>

                            {/* Table */}

                            <Box
                                sx={{
                                    overflow: "auto",

                                    minHeight: 0,

                                    flex: 1,

                                    scrollbarWidth: "thin",

                                    "&::-webkit-scrollbar": {
                                        height: 6,
                                        width: 6,
                                    },

                                    "&::-webkit-scrollbar-thumb":
                                    {
                                        background:
                                            "#334155",
                                        borderRadius: 10,
                                    },
                                }}
                            >
                                <Box
                                    component="table"
                                    sx={{
                                        width: "100%",
                                        minWidth: 850,

                                        borderCollapse:
                                            "collapse",
                                    }}
                                >
                                    <Box component="thead">
                                        <Box
                                            component="tr"
                                            sx={{
                                                color: "#94a3b8",
                                                textAlign: "left",
                                                position: "sticky",
                                                top: 0,
                                                background: "#0f172a",
                                                zIndex: 1,
                                            }}
                                        >
                                            {[
                                                "Repository",
                                                "Type",
                                                "Owner / Org",
                                                "Branch",
                                                "Build",
                                                "Open PRs",
                                                "Deploy",
                                                // "Security",
                                                "Activity",
                                            ].map((head) => (
                                                <Box
                                                    component="th"
                                                    key={head}
                                                    sx={{
                                                        p: 1.25,
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {head}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>

                                    <Box component="tbody">
                                        {filteredRepoDetails.map(
                                            (repo) => (
                                                <Box
                                                    component="tr"
                                                    key={
                                                        repo.name
                                                    }
                                                    sx={{
                                                        borderTop: "1px solid #1e293b",
                                                        "&:hover": {
                                                            background:
                                                                "rgba(30, 41, 59, 0.45)",
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                            fontWeight: 700,
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {repo.name}
                                                    </Box>

                                                    <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                        }}
                                                    >
                                                        <Chip
                                                            size="small"
                                                            label={
                                                                repo.type
                                                            }
                                                            color="info"
                                                        />
                                                    </Box>

                                                    <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            repo.owner
                                                        }
                                                    </Box>

                                                    <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            repo.branch
                                                        }
                                                    </Box>

                                                    <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                        }}
                                                    >
                                                        <Chip
                                                            size="small"
                                                            label={repo.build}
                                                            color={getStatusColor(repo.build)}
                                                        />
                                                    </Box>

                                                    <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {repo.prs}
                                                    </Box>

                                                    <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                        }}
                                                    >
                                                        <Chip
                                                            size="small"
                                                            label={repo.deploy}
                                                            color={getStatusColor(repo.deploy)}
                                                        />
                                                    </Box>

                                                    {/* <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                        }}
                                                    >
                                                        <Chip
                                                            size="small"
                                                            label={
                                                                repo.security
                                                            }
                                                            color={getStatusColor(
                                                                repo.security
                                                            )}
                                                        />
                                                    </Box> */}

                                                    <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            repo.activity
                                                        }
                                                    </Box>
                                                </Box>
                                            )
                                        )}

                                        {filteredRepoDetails.length ===
                                            0 && (
                                                <Box
                                                    component="tr"
                                                >
                                                    <Box
                                                        component="td"
                                                        colSpan={9}
                                                        sx={{
                                                            p: 3,
                                                            textAlign: "center",
                                                            color: "#64748b",
                                                        }}
                                                    >
                                                        {repoSearch
                                                            ? "No repositories match your search."
                                                            : "No repository data available."}
                                                    </Box>
                                                </Box>
                                            )}
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* =====================================================
                    RIGHT COLUMN
                ====================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        lg: 4,
                    }}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        minHeight: 0,
                        height: "100%",
                        overflow: "hidden",
                    }}
                >
                    {/* =================================================
                        AI INSIGHTS
                    ================================================== */}

                    <Card
                        sx={{
                            flex: 2,
                            minHeight: 0,
                            display: "flex",
                            flexDirection: "column",
                            background: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid #1e293b",
                            color: "#e5e7eb",
                            borderRadius: 3,
                            overflow: "hidden",
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flex: "1 1 0%",
                                minHeight: 0,
                                overflow: "hidden",
                                "&:last-child": {
                                    pb: 2,
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontSize={theme.typography.h5.fontSize}
                                fontWeight={theme.typography.h5.fontWeight}
                                mb={2}
                            >
                                AI Insights
                            </Typography>

                            {metrics?.duration_count > 0 && (
                                <Box
                                    sx={{
                                        p: 1.5,
                                        mb: 1.5,
                                        borderRadius: 2,
                                        background: "rgba(11, 18, 32, 0.9)",
                                        border: "1px solid #263449",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            gap: 1,
                                            mb: 1.5,
                                        }}
                                    >
                                        <Box>
                                            <Typography fontSize={theme.typography.h6.fontSize} fontWeight={800}>
                                                Pipeline Duration Percentiles
                                            </Typography>
                                            <Typography
                                                color="#A78BFA"
                                                fontSize={theme.typography.body1.fontSize}
                                                fontWeight={theme.typography.body1.fontWeight}
                                                sx={{ letterSpacing: 0.6, mt: 0.5 }}
                                            >
                                                AUGMENTED AVL ORDER STATISTICS
                                            </Typography>
                                        </Box>

                                        <Chip
                                            size="small"
                                            label={`${metrics.duration_count} sample${metrics.duration_count === 1 ? "" : "s"
                                                }`}
                                            sx={{
                                                color: "#C4B5FD",
                                                background: "#272044",
                                                fontSize: theme.typography.body1.fontSize,
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                                            gap: 0.75,
                                        }}
                                    >
                                        {percentileRows.map(({ label, rank, value }) => (
                                            <Box
                                                key={label}
                                                sx={{
                                                    minWidth: 0,
                                                    p: 0.75,
                                                    borderRadius: 1.5,
                                                    background: "#111C30",
                                                    border: "1px solid #273650",
                                                }}
                                            >
                                                <Typography
                                                    color="#94A3B8"
                                                    fontSize={theme.typography.body1.fontSize}
                                                    fontWeight={700}
                                                >
                                                    {label}
                                                </Typography>

                                                <Typography
                                                    color="#F8FAFC"
                                                    fontSize={theme.typography.h6.fontSize}
                                                    fontWeight={800}
                                                    noWrap
                                                    sx={{ mt: 0.75 }}
                                                >
                                                    {formatDuration(value)}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        mt: 1,
                                                        height: 4,
                                                        borderRadius: 99,
                                                        background: "#25344B",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: `${rank}%`,
                                                            height: "100%",
                                                            borderRadius: 99,
                                                            background:
                                                                "linear-gradient(90deg, #6366F1, #A78BFA)",
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Scrollable Incident Queue and Pipeline Insights */}
                            <Box
                                sx={{
                                    flex: 2,
                                    minHeight: 0,
                                    maxHeight: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    overflow: "hidden",
                                }}
                            >

                                {/* Incident Queue */}
                                <Box sx={{
                                    mt: 1.5,
                                    flex: "1 1 0%",
                                    minHeight: 0,
                                    minWidth: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    overflow: "hidden",
                                }}>
                                    {/* Header */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 1,
                                            mb: 1.5,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <ShieldAlert size={19} color="#f87171" />
                                            <Typography fontSize={theme.typography.h6.fontSize} fontWeight={theme.typography.h6.fontWeight}>
                                                Incident Queue
                                            </Typography>
                                        </Box>

                                        <Chip
                                            size="small"
                                            label={`${incidentCount} pending`}
                                            icon={<ShieldAlert size={13} />}
                                            sx={{
                                                height: 25,
                                                color: incidentCount > 0 ? "#fca5a5" : "#86efac",
                                                backgroundColor:
                                                    incidentCount > 0
                                                        ? "rgba(239, 68, 68, 0.12)"
                                                        : "rgba(34, 197, 94, 0.10)",
                                                border: `1px solid ${incidentCount > 0
                                                    ? "rgba(239, 68, 68, 0.25)"
                                                    : "rgba(34, 197, 94, 0.25)"
                                                    }`,
                                                "& .MuiChip-icon": {
                                                    color: "inherit",
                                                    ml: 0.75,
                                                },
                                                "& .MuiChip-label": {
                                                    px: 1,
                                                    fontSize: theme.typography.body1.fontSize,
                                                    fontWeight: theme.typography.body1.fontWeight,
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Incident Cards */}
                                    {incidents.length > 0 ? (
                                        <Box sx={{
                                            flex: "1 1 0%",
                                            minHeight: 0,
                                            minWidth: 0,
                                            overflowY: "auto",
                                            overflowX: "hidden",
                                            scrollbarWidth: "thin",
                                            scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.default}`,
                                            "&::-webkit-scrollbar": {
                                                width: 6,
                                            },
                                            "&::-webkit-scrollbar-thumb": {
                                                background: theme.palette.primary.main,
                                                borderRadius: 8,
                                            },
                                        }}>
                                            {incidents.map((incident: any) => {
                                                const pipeline = pipelineCards[incident.pipeline_id];
                                                const originEvent = (dashboardSummaryData?.recent_activity?.items ?? [])
                                                    .filter((event: any) => event.pipeline_id === incident.pipeline_id && Boolean(event.service_id))
                                                    .sort((a: any, b: any) => b.timestamp - a.timestamp)[0];

                                                const severity = Math.max(
                                                    0,
                                                    Math.min(10, Number(incident.severity ?? 0))
                                                );

                                                const isCritical = severity >= 8;
                                                const severityColor = isCritical ? "#f87171" : "#fbbf24";

                                                return (
                                                    <Box
                                                        key={incident.incident_id}
                                                        sx={{
                                                            p: 1.75,
                                                            borderRadius: 2.5,
                                                            border: `1px solid ${isCritical
                                                                ? "rgba(239, 68, 68, 0.30)"
                                                                : "rgba(245, 158, 11, 0.28)"
                                                                }`,
                                                            background: isCritical
                                                                ? "linear-gradient(135deg, rgba(127, 29, 29, 0.18), rgba(15, 23, 42, 0.72))"
                                                                : "linear-gradient(135deg, rgba(120, 53, 15, 0.14), rgba(15, 23, 42, 0.72))",
                                                            transition: "border-color 0.2s ease",
                                                            "&:hover": {
                                                                borderColor: severityColor,
                                                            },
                                                        }}
                                                    >
                                                        {/* Incident details and severity */}
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "flex-start",
                                                                justifyContent: "space-between",
                                                                gap: 1.5,
                                                            }}
                                                        >
                                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 0.75,
                                                                        mb: 0.75,
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            width: 6,
                                                                            height: 6,
                                                                            borderRadius: "50%",
                                                                            backgroundColor: severityColor,
                                                                            flexShrink: 0,
                                                                        }}
                                                                    />

                                                                    <Typography
                                                                        sx={{
                                                                            color: severityColor,
                                                                            fontSize: theme.typography.body2.fontSize,
                                                                            fontWeight: theme.typography.body2.fontWeight,
                                                                            letterSpacing: 1,
                                                                        }}
                                                                    >
                                                                        BUILD FAILURE
                                                                    </Typography>
                                                                </Box>

                                                                <Typography
                                                                    sx={{
                                                                        color: "#f1f5f9",
                                                                        fontSize: theme.typography.body1.fontSize,
                                                                        fontWeight: theme.typography.body1.fontWeight,
                                                                        overflowWrap: "anywhere",
                                                                    }}
                                                                >
                                                                    {pipeline?.repository ?? incident.pipeline_id}
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        color: "#94a3b8",
                                                                        fontSize: theme.typography.body2.fontSize,
                                                                        lineHeight: 1.5,
                                                                        mt: 0.5,
                                                                    }}
                                                                >
                                                                    {incident.description ?? "Incident detected"}
                                                                </Typography>
                                                                <Button
                                                                    size="small"
                                                                    startIcon={<Network size={16} />}
                                                                    onClick={() => {
                                                                        setSelectedIncident(incident);
                                                                        setSelectedSourceServiceId(originEvent?.service_id ?? null);
                                                                        setSelectedSourceLabel(pipeline?.repository ?? incident.pipeline_id);
                                                                        setImpactDialogOpen(true);
                                                                    }}
                                                                    sx={{
                                                                        mt: 1,
                                                                        px: 0,
                                                                        textTransform: "none",
                                                                        fontWeight: 700,
                                                                        color: "#7dd3fc",
                                                                        justifyContent: "flex-start",
                                                                        alignSelf: "flex-start",
                                                                        "&:hover": {
                                                                            backgroundColor: "rgba(14, 165, 233, 0.08)",
                                                                        },
                                                                    }}
                                                                >
                                                                    View impact graph
                                                                </Button>
                                                            </Box>

                                                            {/* Severity indicator */}
                                                            <Box
                                                                sx={{
                                                                    flexShrink: 0,
                                                                    minWidth: 65,
                                                                    px: 1,
                                                                    py: 1,
                                                                    borderRadius: 2,
                                                                    textAlign: "center",
                                                                    backgroundColor: `${severityColor}12`,
                                                                    border: `1px solid ${severityColor}35`,
                                                                }}
                                                            >
                                                                <Typography
                                                                    sx={{
                                                                        color: "#94a3b8",
                                                                        fontSize: theme.typography.body2.fontSize,
                                                                        fontWeight: theme.typography.body2.fontWeight,
                                                                        letterSpacing: 0.5,
                                                                    }}
                                                                >
                                                                    SEVERITY
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        color: severityColor,
                                                                        fontSize: theme.typography.h5.fontSize,
                                                                        fontWeight: theme.typography.h5.fontWeight,
                                                                        lineHeight: 1.4,
                                                                    }}
                                                                >
                                                                    {severity}
                                                                    <Box
                                                                        component="span"
                                                                        sx={{
                                                                            color: "#64748b",
                                                                            fontSize: theme.typography.body2.fontSize,
                                                                            fontWeight: theme.typography.body2.fontWeight,
                                                                        }}
                                                                    >
                                                                        /10
                                                                    </Box>
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        {/* Severity bar */}
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={severity * 10}
                                                            sx={{
                                                                mt: 1.5,
                                                                height: 4,
                                                                borderRadius: 10,
                                                                backgroundColor: "rgba(148, 163, 184, 0.12)",
                                                                "& .MuiLinearProgress-bar": {
                                                                    borderRadius: 10,
                                                                    backgroundColor: severityColor,
                                                                },
                                                            }}
                                                        />

                                                        {/* Run metadata and workflow link */}
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "space-between",
                                                                flexWrap: "wrap",
                                                                gap: 1,
                                                                mt: 1.5,
                                                                pt: 1.25,
                                                                borderTop: "1px solid rgba(148, 163, 184, 0.12)",
                                                            }}
                                                        >
                                                            <Box sx={{ minWidth: 0 }}>
                                                                <Typography
                                                                    sx={{
                                                                        color: "#cbd5e1",
                                                                        fontSize: theme.typography.body2.fontSize,
                                                                        fontWeight: theme.typography.body2.fontWeight,
                                                                    }}
                                                                >
                                                                    {pipeline?.branch ?? "Unknown branch"}
                                                                    {pipeline?.latest_run_number != null &&
                                                                        ` · Run #${pipeline.latest_run_number}`}
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        color: "#64748b",
                                                                        fontSize: theme.typography.body2.fontSize,
                                                                        mt: 0.5,
                                                                    }}
                                                                >
                                                                    {formatRelativeTime(incident.timestamp)}
                                                                </Typography>
                                                            </Box>

                                                            {pipeline?.html_url && (
                                                                <Box
                                                                    component="a"
                                                                    href={pipeline.html_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    sx={{
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        gap: 0.5,
                                                                        flexShrink: 0,
                                                                        color: "#7dd3fc",
                                                                        fontSize: theme.typography.body2.fontSize,
                                                                        fontWeight: theme.typography.body2.fontWeight,
                                                                        textDecoration: "none",
                                                                        "&:hover": {
                                                                            color: "#bae6fd",
                                                                            textDecoration: "underline",
                                                                        },
                                                                    }}
                                                                >
                                                                    View workflow ↗
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    ) : (
                                        <Box
                                            sx={{
                                                py: 3,
                                                px: 2,
                                                textAlign: "center",
                                                borderRadius: 2,
                                                border: "1px dashed #263449",
                                                backgroundColor: "rgba(11, 18, 32, 0.45)",
                                            }}
                                        >
                                            <ShieldAlert size={22} color="#64748b" />

                                            <Typography
                                                sx={{ mt: 1, fontSize: theme.typography.body1.fontSize, fontWeight: 700, color: "#cbd5e1" }}
                                            >
                                                No active incidents
                                            </Typography>

                                            <Typography sx={{ mt: 0.5, fontSize: theme.typography.body2.fontSize, color: "#64748b" }}>
                                                You're all clear for now.
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    scrollbarWidth: "thin",
                                    scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.default}`,
                                    "&::-webkit-scrollbar": {
                                        width: 6,
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        background: theme.palette.primary.main,
                                        borderRadius: 8,
                                    },
                                }}
                            >
                                {insights.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Box
                                            key={item.title}
                                            sx={{
                                                p: 1.75,
                                                mt: 2,
                                                mb: 1.25,
                                                "&:last-child": {
                                                    mb: 0,
                                                },
                                                borderRadius: 2,
                                                background: `${item.color}16`,
                                                border: `1px solid ${item.color}33`,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1.5,
                                                    alignItems: "flex-start",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        flexShrink: 0,
                                                        mt: 0.25,
                                                    }}
                                                >
                                                    <Icon
                                                        size={20}
                                                        color={item.color}
                                                    />
                                                </Box>

                                                <Box
                                                    sx={{
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    <Typography
                                                        fontWeight={700}
                                                        fontSize={theme.typography.h6.fontSize}
                                                        lineHeight={1.4}
                                                    >
                                                        {item.title}
                                                    </Typography>

                                                    <Typography
                                                        color={item.color}
                                                        fontSize={theme.typography.body1.fontSize}
                                                        fontWeight={600}
                                                        mt={0.75}
                                                    >
                                                        {item.action}{" "}
                                                        →
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })}

                            </Box>
                        </CardContent>
                    </Card>

                    {/* =================================================
                        RECENT ACTIVITY
                    ================================================== */}

                    <Card
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            display: "flex",
                            flexDirection: "column",
                            background: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid #1e293b",
                            color: "#e5e7eb",
                            borderRadius: 3,
                            overflow: "hidden",
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flex: "1 1 0%",
                                minHeight: 0,
                                overflow: "hidden",
                                "&:last-child": { pb: 2, },
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontSize={theme.typography.h5.fontSize}
                                fontWeight={theme.typography.h5.fontWeight}
                                mb={2}
                                flexShrink={0}
                            >
                                Recent Activity
                            </Typography>

                            <Box
                                sx={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: "auto",
                                    "&::-webkit-scrollbar": {
                                        width: 8,
                                    },
                                    "&::-webkit-scrollbar-track": {
                                        background: theme.palette.background.default,
                                        borderRadius: 8,
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        background: theme.palette.primary.main,
                                        borderRadius: 8,
                                    },
                                    "&::-webkit-scrollbar-thumb:hover": {
                                        background: theme.palette.primary.dark,
                                    },
                                    scrollbarWidth: "thin",
                                    scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.default}`,
                                }}
                            >
                                {activities.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Box
                                            key={item.title}
                                            sx={{
                                                display: "flex",
                                                gap: 1.5,
                                                py: 1.5,
                                                borderBottom: "1px solid #1e293b",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 38,
                                                    height: 38,
                                                    flexShrink: 0,
                                                    borderRadius: 2,
                                                    display: "grid",
                                                    placeItems: "center",
                                                    color: item.color,
                                                    background: `${item.color}22`,
                                                }}
                                            >
                                                <Icon size={20} />
                                            </Box>

                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <Typography
                                                    fontWeight={theme.typography.h6.fontWeight}
                                                    fontSize={theme.typography.h6.fontSize}
                                                    noWrap
                                                >
                                                    {item.title}
                                                </Typography>

                                                <Typography
                                                    color="#94a3b8"
                                                    fontSize={theme.typography.body1.fontSize}
                                                    noWrap
                                                >
                                                    {item.desc}
                                                </Typography>
                                            </Box>

                                            <Typography
                                                color="#94a3b8"
                                                fontSize={theme.typography.body1.fontSize}
                                                sx={{
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {item.time}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog
                open={impactDialogOpen}
                onClose={() => setImpactDialogOpen(false)}
                fullWidth
                maxWidth="md"
                scroll="paper"
                PaperProps={{
                    sx: {
                        background: "#0b1220",
                        color: "#e5e7eb",
                        border: "1px solid #263449",
                        borderRadius: 3,
                        width: "100%",
                        maxHeight: "85vh",
                        overflow: "hidden",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        borderBottom: "1px solid #263449",
                        pr: 1.5,
                    }}
                >
                    <Network size={20} color="#f87171" />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={800}>Incident Impact Graph</Typography>
                        <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
                            Explore affected services and impact levels
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => setImpactDialogOpen(false)}
                        aria-label="Close impact graph"
                        sx={{ color: "#94a3b8" }}
                    >
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    dividers
                    sx={{
                        p: { xs: 1.5, sm: 3 },
                        overflowY: "auto",
                        minHeight: 0,
                        borderColor: "#263449",
                    }}
                >
                    {selectedIncident && (
                        <IncidentImpactMap
                            incident={selectedIncident}
                            sourceServiceId={selectedSourceServiceId}
                            sourceLabel={selectedSourceLabel}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* =========================================================
                REPOSITORY DETAILS DIALOG
            ========================================================== */}

            <RepoDetailsDialog
                open={repoDialogOpen}
                onClose={() => setRepoDialogOpen(false)}
                repos={repoDetails}
            />
            {/* =========================================================
                    AI HEALTH DETAILS DIALOG
                ========================================================== */}

            <AIHealthScoreDialog
                open={aiHealthDialogOpen}
                onClose={() => setAiHealthDialogOpen(false)}
                health={rows.ai_health}
            />
        </Box>
    );
};

export default Home;