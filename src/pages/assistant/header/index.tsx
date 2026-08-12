import { Box } from "@mui/system";
import type React from "react";
import ShieldIcon from "@mui/icons-material/Security";
import { Chip, Typography, type SelectChangeEvent } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { CustomSelect } from "../../../components/customSelect";

interface Props {
    branchName: string,
    setBranchName: any
}

const AssistantHeader: React.FC<Props> = ({ branchName, setBranchName }) => {
    const handleSelectChange = (e: SelectChangeEvent) => {
        setBranchName((prev: any) => e.target.value)
    }
    return (
        <Box
            sx={{
                px: 3,
                py: 2,
                borderBottom: "1px solid #1e293b",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            {/* Left */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                    <ShieldIcon color="success" />
                    <Typography fontWeight="bold">AI Assistant</Typography>
                </Box>

                {/* <Chip label="v1.0.0" size="small" /> */}
                {/* <Chip label="Development" size="small" color="success" /> */}
                <CustomSelect
                    value={branchName}
                    handleChange={handleSelectChange}
                    menuItems={[
                        { id: 1, name: "development" },
                        { id: 2, name: "staging" },
                        { id: 3, name: "production" },
                    ]}
                    label="Branch"

                />

            </Box>

            {/* Right */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <Typography variant="body2">System Status: Online</Typography>
                <SettingsIcon />
            </Box>

        </Box>
    )
}

export default AssistantHeader