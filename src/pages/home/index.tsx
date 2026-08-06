import type React from "react";
import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    TextField,
    InputAdornment,
    LinearProgress,
    Skeleton,
} from "@mui/material";
import {
    Search,
    RefreshCw,
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
        value: "5",
        change: "↑ 2 from yesterday",
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
        time: "15m ago",
        color: "#ef4444",
    },
    {
        icon: CircleCheck,
        title: "Build #104 succeeded in auth-service",
        desc: "Main branch",
        time: "28m ago",
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
        time: "45m ago",
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
};

const getStatusColor = (
    status: string
): "success" | "error" | "warning" | "info" | "default" => {
    switch (status) {
        case "Success":
        case "Low":
            return "success";
        case "Failed":
        case "High":
            return "error";
        case "Running":
        case "Medium":
            return "warning";
        case "In Progress":
            return "info";
        default:
            return "default";
    }
};

const Home: React.FC = () => {
    const { data: rows, isLoading } = useRepoDetailsCount();

    const [countData, setCountData] = useState(stats);
    const [repoDialogOpen, setRepoDialogOpen] = useState(false);
    const [repoDetails, setRepoDetails] = useState<RepoDetails[]>([]);
    const [repoLoaded, setRepoLoaded] = useState(false);

    useEffect(() => {
        // if (!repoDialogOpen) return;

        const fetchData = async () => {
            try {
                setRepoLoaded(true);

                const fetchRes = await Server.dashboard_repo_details();
                setRepoDetails(fetchRes.data ?? []);
            } catch (error) {
                console.error("Failed to fetch repo details", error);
                setRepoDetails([]);
            } finally {
                setRepoLoaded(false);
            }
        };

        fetchData();
    },
        []
        // [repoDialogOpen]
    );

    useEffect(() => {
        if (!rows) return;

        setCountData((prev) =>
            prev.map((obj) => {
                if (obj.title === "Total Repos") {
                    return {
                        ...obj,
                        value: String(rows.repo_count ?? 0),
                    };
                }

                if (obj.title === "Open PRs") {
                    return {
                        ...obj,
                        value: String(rows.open_prs ?? 0),
                    };
                }

                if (obj.title === "Failed Builds") {
                    return {
                        ...obj,
                        value: String(rows.failed_workflow_run_count ?? 0),
                    };
                }

                return obj;
            })
        );
    }, [rows]);

    if (isLoading) {
        return <Skeleton variant="rectangular" height={250} />;
    }

    return (
        <Box
            sx={{
                minHeight: "100%",
                color: "#e5e7eb",
                background:
                    "radial-gradient(circle at top left, #10233f 0%, #07111f 38%, #050b14 100%)",
                p: { xs: 2, md: 3 },
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    alignItems: "center",
                    // mb: 3,
                    flexWrap: "wrap",
                    flex: 1
                }}
            >
                <Box>
                    <Typography color="#94a3b8">
                        Overview of your repositories, builds and DevOps health
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        sx={{ color: "#e5e7eb", borderColor: "#1e293b" }}
                    >
                        Last 24 hours
                    </Button>
                    <Button variant="outlined" sx={{ minWidth: 44, borderColor: "#1e293b" }}>
                        <RefreshCw size={18} />
                    </Button>
                </Box>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                    gap: 2
                }}
            >
                <Grid container spacing={2} sx={{ height: "100%" }}>
                    {countData.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={item.title}>
                                <Card
                                    onClick={() => {
                                        if (item.title === "Total Repos") {
                                            setRepoDialogOpen(true);
                                        }
                                    }}
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
                                                    background: `${item.color}22`,
                                                    color: item.color,
                                                }}
                                            >
                                                <Icon size={28} />
                                            </Box>

                                            <Box>
                                                <Typography color="#94a3b8" fontSize={14}>
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="h4" fontWeight={800}>
                                                    {item.value}
                                                    {"suffix" in item && item.suffix && (
                                                        <Typography component="span" color="#94a3b8" fontSize={18}>
                                                            {item.suffix}
                                                        </Typography>
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography color="#22c55e" fontSize={13} mt={1}>
                                            {item.change}
                                        </Typography>

                                        {"progress" in item && item.progress && (
                                            <LinearProgress
                                                variant="determinate"
                                                value={item.progress}
                                                sx={{ mt: 1.5, height: 6, borderRadius: 99 }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Grid container spacing={2} sx={{ height: "100%" }}>
                    <Grid size={{ xs: 12, lg: 8 }} sx={{ display: "flex", flexDirection: "column", minHeight: 0, gap:2 }} >
                        <Card
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                background: "rgba(15,23,42,.8)",
                                border: "1px solid #1e293b",
                                borderRadius: 3,
                                minHeight: 0,
                            }}
                        >
                            <CardContent sx={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                minHeight: 0,
                            }}>
                                <Typography variant="h6" fontWeight={800} mb={2}>
                                    Repository Activity{" "}
                                    <Typography component="span" color="#94a3b8">
                                        (Last 7 Days)
                                    </Typography>
                                </Typography>

                                <Box
                                    sx={{
                                        height: 220,
                                        borderRadius: 2,
                                        border: "1px dashed #334155",
                                        display: "grid",
                                        placeItems: "center",
                                        color: "#94a3b8",
                                    }}
                                >
                                    Chart Placeholder
                                </Box>
                            </CardContent>
                        </Card>

                        <Card
                            sx={{
                                background: "rgba(15, 23, 42, 0.8)",
                                border: "1px solid #1e293b",
                                color: "#e5e7eb",
                                borderRadius: 3,
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 2,
                                        mb: 2,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={800}>
                                        Repository Overview
                                    </Typography>

                                    <TextField
                                        size="small"
                                        placeholder="Search repositories..."
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search size={18} color="#94a3b8" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            input: { color: "#e5e7eb" },
                                            "& fieldset": { borderColor: "#1e293b" },
                                        }}
                                    />
                                </Box>

                                <Box sx={{ overflowX: "auto", flex: 1, minHeight: 0 }}>
                                    <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                                        <Box component="thead">
                                            <Box component="tr" sx={{ color: "#94a3b8", textAlign: "left" }}>
                                                {[
                                                    "Repository",
                                                    "Type",
                                                    "Owner / Org",
                                                    "Branch",
                                                    "Build",
                                                    "Open PRs",
                                                    "Deploy",
                                                    "Security",
                                                    "Activity",
                                                ].map((head) => (
                                                    <Box component="th" key={head} sx={{ p: 1.5, fontSize: 13 }}>
                                                        {head}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>

                                        <Box component="tbody">
                                            {repoDetails.map((repo) => (
                                                <Box
                                                    component="tr"
                                                    key={repo.name}
                                                    sx={{
                                                        borderTop: "1px solid #1e293b",
                                                        "&:hover": { background: "rgba(30, 41, 59, 0.45)" },
                                                    }}
                                                >
                                                    <Box component="td" sx={{ p: 1.5, fontWeight: 700 }}>
                                                        {repo.name}
                                                    </Box>
                                                    <Box component="td" sx={{ p: 1.5 }}>
                                                        <Chip size="small" label={repo.type} color="info" />
                                                    </Box>
                                                    <Box component="td" sx={{ p: 1.5 }}>
                                                        {repo.owner}
                                                    </Box>
                                                    <Box component="td" sx={{ p: 1.5 }}>
                                                        {repo.branch}
                                                    </Box>
                                                    <Box component="td" sx={{ p: 1.5 }}>
                                                        <Chip
                                                            size="small"
                                                            label={repo.build}
                                                            color={getStatusColor(repo.build)}
                                                        />
                                                    </Box>
                                                    <Box component="td" sx={{ p: 1.5 }}>
                                                        {repo.prs}
                                                    </Box>
                                                    <Box component="td" sx={{ p: 1.5 }}>
                                                        <Chip
                                                            size="small"
                                                            label={repo.deploy}
                                                            color={getStatusColor(repo.deploy)}
                                                        />
                                                    </Box>
                                                    <Box component="td" sx={{ p: 1.5 }}>
                                                        <Chip
                                                            size="small"
                                                            label={repo.security}
                                                            color={getStatusColor(repo.security)}
                                                        />
                                                    </Box>
                                                    <Box component="td" sx={{ p: 1.5 }}>
                                                        {repo.activity}
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Card
                            sx={{
                                background: "rgba(15, 23, 42, 0.8)",
                                border: "1px solid #1e293b",
                                color: "#e5e7eb",
                                borderRadius: 3,
                                mb: 2,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" fontWeight={800} mb={2}>
                                    AI Insights
                                </Typography>

                                {insights.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Box
                                            key={item.title}
                                            sx={{
                                                p: 2,
                                                mb: 1.5,
                                                borderRadius: 2,
                                                background: `${item.color}16`,
                                                border: `1px solid ${item.color}33`,
                                            }}
                                        >
                                            <Box sx={{ display: "flex", gap: 1.5 }}>
                                                <Icon color={item.color} />
                                                <Box>
                                                    <Typography fontWeight={700}>{item.title}</Typography>
                                                    <Typography color={item.color} fontSize={13} mt={1}>
                                                        {item.action} →
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        <Card
                            sx={{
                                background: "rgba(15, 23, 42, 0.8)",
                                border: "1px solid #1e293b",
                                color: "#e5e7eb",
                                borderRadius: 3,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" fontWeight={800} mb={2}>
                                    Recent Activity
                                </Typography>

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
                                                    borderRadius: 2,
                                                    display: "grid",
                                                    placeItems: "center",
                                                    color: item.color,
                                                    background: `${item.color}22`,
                                                }}
                                            >
                                                <Icon size={20} />
                                            </Box>

                                            <Box sx={{ flex: 1 }}>
                                                <Typography fontWeight={700}>{item.title}</Typography>
                                                <Typography color="#94a3b8" fontSize={14}>
                                                    {item.desc}
                                                </Typography>
                                            </Box>

                                            <Typography color="#94a3b8" fontSize={13}>
                                                {item.time}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <RepoDetailsDialog
                open={repoDialogOpen}
                onClose={() => setRepoDialogOpen(false)}
                repos={repoDetails}
            // loading={repoLoaded}
            />
        </Box>
    );
};

export default Home;