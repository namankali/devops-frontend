import { Box } from "@mui/system";
import type React from "react";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import DeploymentMappingsDialog from "../deploymentMapping/deploymentDialogMapping";
import AddDeploymentMappingDialog, { type CreateDeploymentMappingPayload } from "../deploymentMapping/CustomAdd";
import Server from "../../service/Server";

const HeaderFooter: React.FC = () => {
    const [deploymentMappingsOpen, setDeploymentMappingsOpen] =
        useState(false);

    const [addMappingOpen, setAddMappingOpen] = useState(false);
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const [value, setValue] = useState("All");

    const handleBranchChange = (e: any) => {
        setValue(e.target.value);
    };

    return (
        <Box
            sx={{
                pt: 2,
                pb: 2,
                display: "flex",
                flexDirection: "row",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minWidth: "100%",
                    gap: 2,
                    pl: 6,
                    pr: 6
                }}
            >
                {location.pathname === "/builds" && (
                    <>
                        <Button
                            variant="contained"
                            onClick={() => setDeploymentMappingsOpen(true)}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: 2,
                                px: 2,
                                backgroundColor: "#0e7490",
                                "&:hover": {
                                    backgroundColor: "#155e75",
                                },
                            }}
                        >
                            Deployment Mappings
                        </Button>

                        <FormControl
                            size="small"
                            sx={{
                                minWidth: 180,
                                bgcolor: "#1e293b",
                                borderRadius: 1,
                            }}
                        >
                            <InputLabel
                                sx={{ color: "#94a3b8" }}
                                id="branch-filter-label"
                            >
                                Branch
                            </InputLabel>

                            <Select
                                labelId="branch-filter-label"
                                value={value}
                                label="Branch"
                                onChange={handleBranchChange}
                                sx={{
                                    color: "white",
                                    ".MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#334155",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#475569",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#2575fc",
                                    },
                                    ".MuiSvgIcon-root": {
                                        color: "white",
                                    },
                                }}
                            >
                                {[
                                    "All",
                                    "Main",
                                    "Development",
                                    "Staging",
                                    "Production",
                                ].map((branch) => (
                                    <MenuItem
                                        key={branch}
                                        value={branch}
                                    >
                                        {branch}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}
            </Box>

            <Box sx={{ flex: 1 }} />

            <DeploymentMappingsDialog
                open={deploymentMappingsOpen}
                onClose={() => setDeploymentMappingsOpen(false)}
                onAddMapping={() => {
                    setDeploymentMappingsOpen(false);
                    setAddMappingOpen(true);
                }}
            />

            <AddDeploymentMappingDialog
                open={addMappingOpen}
                onClose={() => {
                    setAddMappingOpen(false);
                    setDeploymentMappingsOpen(true);
                }}
                onSave={async (payload: CreateDeploymentMappingPayload) => {
                    // Connect this callback to your Node.js POST endpoint next.
                    // Do not report success until the API confirms the mapping was saved.
                    console.log("Deployment mapping payload:", payload);
                    await Server.repository_deployment_targets_save(payload)
                }}
            />
        </Box>
    );
};

export default HeaderFooter;