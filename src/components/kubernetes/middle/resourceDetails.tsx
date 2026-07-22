import { Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { useState } from "react";
import { capitalize } from "@mui/material";
import { KubernetesStore } from "../../../helper/useKubernetesStore";
import { CustomTabResources } from "../../customTabsResources";
import { useResourceDetails } from "../../../hooks/useResourceDetails";
import { filteredPodDetails } from "../../../helper/format";
import { theme } from "../../../theme";
import { StatusIndicator } from "../../statusIndicator";
import CustomDialog from "../../customDialog";

const DetailRow = ({
    label,
    value,
}: {
    label: string;
    value: any;
}) => (
    <Box
        display="flex"
        justifyContent="space-between"
        py={1}
    >
        <Typography sx={{ color: theme.palette.text.primary, ...theme.typography.body1 }}>
            {`${label.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}`}
        </Typography>

        {label === "Status"
            ? <Box sx={{ display: "flex", justifyContent: "center", "alignItems": "center", gap: 2 }}>
                <StatusIndicator
                    state={`${value === "Running" ? "success" : "default"}`}
                />
                <Typography fontWeight={600}>
                    {value ?? "N/A"}
                </Typography>
            </Box>
            : <Typography fontWeight={600}>
                {value ?? "N/A"}
            </Typography>}


    </Box>
);

const ResourceDetails: React.FC = () => {
    const { selectedItem, selectedResource, selectedNamespace, setSelectedItem } = KubernetesStore();
    const [openYaml, setOpenYaml] = useState(false);

    const [tab, setTab] = useState(0);

    const {
        data: selectedResourceDetails = {},
        isLoading,
        error
    } = useResourceDetails(
        selectedItem?.name,
        selectedNamespace,
        selectedResource
    );

    if (!selectedItem) {
        return (
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                Nothing Selected Yet
            </Box>
        );
    }

    // if (isLoading) {
    //     return (
    //         <Box
    //             display="flex"
    //             justifyContent="center"
    //             alignItems="center"
    //             height="100%"
    //         >
    //             Loading...
    //         </Box>
    //     );
    // }

    if (error) {
        return (
            <Box p={2}>
                Failed to load resource details.
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%"
            }}
        >
            <Box sx={{ flex: 3 }}>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                >
                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        {`${capitalize(selectedResource)} : ${selectedItem.name}`}
                    </Typography>

                    <Button
                        onClick={() => setSelectedItem(null)}
                    >
                        Close
                    </Button>
                </Box>

                <CustomTabResources
                    tab={tab}
                    setTab={setTab}
                />

                <Divider />

                {tab === 0 && (
                    <Box
                        sx={{
                            p: 2,
                            overflow: "auto"
                        }}
                    >
                        {Object.entries(filteredPodDetails(selectedResourceDetails)).map(([key, value]) => {
                            return (
                                <DetailRow
                                    key={key}
                                    label={capitalize(key)}
                                    value={value}
                                />
                            )
                        })}
                    </Box>
                )}

                {tab === 1 && (
                    <Box
                        sx={{
                            p: 2,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            YAML Preview
                        </Typography>

                        <Box
                            component="pre"
                            sx={{
                                height: 220,
                                overflow: "hidden",
                                m: 0,
                                p: 2,
                                bgcolor: "grey.900",
                                color: "common.white",
                                borderRadius: 1,
                                whiteSpace: "pre",
                                fontFamily: "Monaco, Consolas, monospace",
                                fontSize: 12,
                            }}
                        >
                            {selectedResourceDetails.yaml.length === 0
                                ? "No Data Available"
                                : selectedResourceDetails.yaml
                                    ?.split("\n")
                                    .slice(0, 20)
                                    .join("\n")}
                        </Box>

                        <Button
                            sx={{ mt: 2, color: "black" }}
                            variant="contained"
                            onClick={() => setOpenYaml(true)}
                            disabled={!selectedResourceDetails.yaml}
                        >
                            View Full YAML
                        </Button>
                    </Box>
                )}

            </Box>

            <Box
                sx={{
                    flex: 1,
                    bgcolor: "grey.200"
                }}
            >
                Lower Section
            </Box>

            {/* YAML preview */}
            <CustomDialog
                open={openYaml}
                onClose={() => setOpenYaml(false)}
            >
                <DialogTitle>
                    Deployment YAML
                </DialogTitle>

                <DialogContent dividers>

                    <Box
                        component="pre"
                        sx={{
                            m: 0,
                            p: 2,
                            bgcolor: "grey.900",
                            color: "common.white",

                            height: "70vh",

                            overflow: "auto",

                            whiteSpace: "pre",

                            fontFamily: "Monaco, Consolas, monospace",
                        }}
                    >
                        {selectedResourceDetails.yaml}
                    </Box>

                </DialogContent>
            </CustomDialog>

        </Box>
    );
};

export default ResourceDetails;