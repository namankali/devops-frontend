import {
    Box,
    Chip,
    Stack,
    Typography,
} from "@mui/material";
import {
    AlertTriangle,
    ArrowDown,
    Network,
    Server,
} from "lucide-react";

interface IncidentImpact {
    incident_id: string;
    description?: string;
    affected_services?: string[];
    impact_levels?: Record<string, string[]>;
}

interface IncidentImpactMapProps {
    incident: IncidentImpact;
    sourceServiceId?: string | null;
    sourceLabel?: string;
}

const IncidentImpactMap = ({
    incident,
    sourceServiceId,
    sourceLabel = "Failed workflow",
}: IncidentImpactMapProps) => {
    const levels = Object.entries(incident.impact_levels ?? {})
        .filter(([, services]) => Array.isArray(services) && services.length > 0)
        .sort(([levelA], [levelB]) => Number(levelA) - Number(levelB));

    const displayLevels =
        levels.length > 0
            ? levels
            : (incident.affected_services?.length ?? 0) > 0
              ? [["Unknown", incident.affected_services!] as [string, string[]]]
              : [];

    const renderService = (serviceId: string) => {
        const parts = serviceId.split("/");
        const serviceName = parts.pop() ?? serviceId;
        const namespace = parts.join("/");

        return (
            <Box
                key={serviceId}
                title={serviceId}
                sx={{
                    minWidth: 170,
                    maxWidth: 260,
                    flex: "1 1 170px",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.35)",
                    textAlign: "center",
                    overflowWrap: "anywhere",
                }}
            >
                <Server size={20} color="#fbbf24" />
                <Typography
                    sx={{
                        mt: 0.75,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#f8fafc",
                    }}
                >
                    {serviceName}
                </Typography>
                {namespace && (
                    <Typography
                        sx={{ mt: 0.25, fontSize: 11, color: "#94a3b8" }}
                    >
                        Namespace: {namespace}
                    </Typography>
                )}
            </Box>
        );
    };

    return (
        <Box
            sx={{
                mt: 2,
                p: 2,
                borderRadius: 2.5,
                backgroundColor: "rgba(2, 6, 23, 0.45)",
                border: "1px solid #263449",
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
            >
                <Network size={19} color="#f87171" />
                <Typography
                    sx={{ color: "#f1f5f9", fontSize: 14, fontWeight: 800 }}
                >
                    Incident Impact Map
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Chip
                    size="small"
                    label={`${incident.affected_services?.length ?? 0} affected`}
                    sx={{
                        color: "#fca5a5",
                        backgroundColor: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                    }}
                />
            </Stack>

            <Box
                sx={{
                    mx: "auto",
                    width: "100%",
                    maxWidth: 360,
                    p: 2,
                    borderRadius: 2,
                    textAlign: "center",
                    backgroundColor: "rgba(127, 29, 29, 0.28)",
                    border: "1px solid rgba(248, 113, 113, 0.65)",
                }}
            >
                <AlertTriangle size={22} color="#f87171" />
                <Typography
                    sx={{
                        mt: 0.75,
                        fontWeight: 800,
                        fontSize: 13,
                        color: "#fee2e2",
                        overflowWrap: "anywhere",
                    }}
                >
                    {sourceServiceId || "Failed workflow"}
                </Typography>
                <Typography
                    sx={{
                        mt: 0.5,
                        fontSize: 11,
                        color: "#fca5a5",
                        overflowWrap: "anywhere",
                    }}
                >
                    {sourceServiceId
                        ? "Triggering service"
                        : `Origin: ${sourceLabel} · Service mapping unavailable`}
                </Typography>
            </Box>

            {displayLevels.length > 0 ? (
                displayLevels.map(([level, services], index) => (
                    <Box key={level}>
                        <Stack alignItems="center" spacing={0.5} sx={{ py: 1.5 }}>
                            <ArrowDown
                                size={20}
                                color={index === 0 ? "#f87171" : "#fbbf24"}
                            />
                            <Chip
                                size="small"
                                label={
                                    level === "Unknown"
                                        ? "Impact level unknown"
                                        : `Impact level ${level}`
                                }
                                sx={{
                                    color: index === 0 ? "#fca5a5" : "#fde68a",
                                    backgroundColor:
                                        index === 0
                                            ? "rgba(239, 68, 68, 0.1)"
                                            : "rgba(245, 158, 11, 0.1)",
                                    border: `1px solid ${
                                        index === 0
                                            ? "rgba(239, 68, 68, 0.3)"
                                            : "rgba(245, 158, 11, 0.3)"
                                    }`,
                                }}
                            />
                        </Stack>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: 1.25,
                            }}
                        >
                            {services.map(renderService)}
                        </Box>
                    </Box>
                ))
            ) : (
                <Typography
                    sx={{ mt: 2, textAlign: "center", color: "#94a3b8", fontSize: 12 }}
                >
                    No affected-service levels were returned for this incident.
                </Typography>
            )}
        </Box>
    );
};

export default IncidentImpactMap;
