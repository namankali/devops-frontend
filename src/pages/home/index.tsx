import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    TextField,
    InputAdornment,
    LinearProgress,
    Skeleton,
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
} from "lucide-react";

import { useRepoDetailsCount } from "../../hooks/userRepoDetailsCount";
import RepoDetailsDialog from "./components/totalReposDialog";
import Server from "../../service/Server";
import AIHealthScoreDialog from "./components/aiHealthScore";
import { KubernetesOverview } from "./components/kubenetesHealthOverview";
import type { KubernetesHealthData } from "../../utils/types";
import { KubernetesStore } from "../../helper/useKubernetesStore";
import { useKubernetesDashboard } from "../../hooks/useKubernetesDashboard";

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
        change: "↑ 5 from yesterday",
        icon: Bot,
        color: "#8b5cf6",
        progress: 82,
    },
];

const insights = [
    {
        icon: AlertTriangle,
        title: "ai-devops-api has failed 3 builds in the last 24 hours.",
        action: "View Details",
        color: "#ef4444",
    },
    {
        icon: GitPullRequest,
        title: "devops-frontend has 4 open PRs waiting for review.",
        action: "View PRs",
        color: "#8b5cf6",
    },
    {
        icon: AlertTriangle,
        title: "Suspicious login attempts detected in auth-service logs.",
        action: "View Logs",
        color: "#f59e0b",
    },
];

const activities = [
    {
        icon: GitPullRequest,
        title: "PR #42 opened in devops-frontend",
        desc: "Add dark mode support",
        time: "10m ago",
        color: "#8b5cf6",
    },
    {
        icon: CircleX,
        title: "Build #105 failed in ai-devops-api",
        desc: "Unit tests failed",
        time: "15hrs ago",
        color: "#ef4444",
    },
    {
        icon: CircleCheck,
        title: "Build #104 succeeded in auth-service",
        desc: "Main branch",
        time: "5 days ago",
        color: "#22c55e",
    },
    {
        icon: Rocket,
        title: "Deployment started for auth-service",
        desc: "Staging environment",
        time: "35m ago",
        color: "#06b6d4",
    },
    {
        icon: Shield,
        title: "Security alert in auth-service",
        desc: "Unusual login activity detected",
        time: "2 days ago",
        color: "#f59e0b",
    },
];

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
    const [selectedClusterName, setSelectedClusterName] = useState("");
    const { data: rows, isLoading } = useRepoDetailsCount();
    const {
        data: kubDashboardData,
        isLoading: defaultKubeDashboardLoading
    } = useKubernetesDashboard(selectedClusterName)

    const { selectedDisplayName, setSelectedDisplayName } = KubernetesStore()

    const [repoDialogOpen, setRepoDialogOpen] = useState(false);
    const [aiHealthDialogOpen, setAiHealthDialogOpen] = useState(false);
    const [repoDetails, setRepoDetails] = useState<RepoDetails[]>([]);
    const [repoSearch, setRepoSearch] = useState("");

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
                                                color:
                                                    "#94a3b8",
                                                textAlign:
                                                    "left",

                                                position:
                                                    "sticky",

                                                top: 0,

                                                background:
                                                    "#0f172a",

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

                                                        fontWeight:
                                                            700,

                                                        whiteSpace:
                                                            "nowrap",
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
                                                        borderTop:
                                                            "1px solid #1e293b",

                                                        "&:hover":
                                                        {
                                                            background:
                                                                "rgba(30, 41, 59, 0.45)",
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                            fontWeight:
                                                                700,
                                                            whiteSpace:
                                                                "nowrap",
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
                                                            whiteSpace:
                                                                "nowrap",
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
                                                            whiteSpace:
                                                                "nowrap",
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
                                                            label={
                                                                repo.build
                                                            }
                                                            color={getStatusColor(
                                                                repo.build
                                                            )}
                                                        />
                                                    </Box>

                                                    <Box
                                                        component="td"
                                                        sx={{
                                                            p: 1.25,
                                                            textAlign:
                                                                "center",
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
                                                            label={
                                                                repo.deploy
                                                            }
                                                            color={getStatusColor(
                                                                repo.deploy
                                                            )}
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
                                                            whiteSpace:
                                                                "nowrap",
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
                                                            textAlign:
                                                                "center",
                                                            color:
                                                                "#64748b",
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
                    }}
                >
                    {/* =================================================
                        AI INSIGHTS
                    ================================================== */}

                    <Card
                        sx={{
                            flexShrink: 0,

                            background:
                                "rgba(15, 23, 42, 0.8)",

                            border: "1px solid #1e293b",

                            color: "#e5e7eb",

                            borderRadius: 3,

                            overflow: "hidden",
                        }}
                    >
                        <CardContent
                            sx={{
                                "&:last-child": {
                                    pb: 2,
                                },
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                mb={2}
                            >
                                AI Insights
                            </Typography>

                            {insights.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Box
                                        key={item.title}
                                        sx={{
                                            p: 1.75,

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
                                                display:
                                                    "flex",

                                                gap: 1.5,

                                                alignItems:
                                                    "flex-start",
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
                                                    color={
                                                        item.color
                                                    }
                                                />
                                            </Box>

                                            <Box
                                                sx={{
                                                    minWidth: 0,
                                                }}
                                            >
                                                <Typography
                                                    fontWeight={700}
                                                    fontSize={14}
                                                    lineHeight={
                                                        1.4
                                                    }
                                                >
                                                    {item.title}
                                                </Typography>

                                                <Typography
                                                    color={
                                                        item.color
                                                    }
                                                    fontSize={
                                                        12
                                                    }
                                                    fontWeight={
                                                        600
                                                    }
                                                    mt={0.75}
                                                >
                                                    {
                                                        item.action
                                                    }{" "}
                                                    →
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })}
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

                            background:
                                "rgba(15, 23, 42, 0.8)",

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

                                flex: 1,

                                minHeight: 0,

                                "&:last-child": {
                                    pb: 2,
                                },
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={800}
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

                                    scrollbarWidth: "thin",

                                    "&::-webkit-scrollbar": {
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
                                {activities.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Box
                                            key={item.title}
                                            sx={{
                                                display:
                                                    "flex",

                                                gap: 1.5,

                                                py: 1.5,

                                                borderBottom:
                                                    "1px solid #1e293b",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 38,
                                                    height: 38,

                                                    flexShrink: 0,

                                                    borderRadius: 2,

                                                    display:
                                                        "grid",
                                                    placeItems:
                                                        "center",

                                                    color:
                                                        item.color,

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
                                                    fontWeight={700}
                                                    fontSize={14}
                                                    noWrap
                                                >
                                                    {item.title}
                                                </Typography>

                                                <Typography
                                                    color="#94a3b8"
                                                    fontSize={13}
                                                    noWrap
                                                >
                                                    {item.desc}
                                                </Typography>
                                            </Box>

                                            <Typography
                                                color="#94a3b8"
                                                fontSize={12}
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