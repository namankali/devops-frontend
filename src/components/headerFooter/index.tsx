import { Box } from "@mui/system";
import type React from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import Icons from "../icons"
import { useLocation } from "react-router-dom";
const HeaderFooter: React.FC = () => {
    const theme = useTheme()
    const location = useLocation()
    const handleBranchChange = () => {
        console.log("back handler is clicked")
    }
    return (
        <Box
            sx={{
                pt: 2,
                pb: 2,
                display: "flex",
                flexDirection: "row",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                // justifyContent: "space-between"
            }}
        >
            <Box sx={{ flex: 1, display: "flex", justifyContent: "end", minWidth: "90%" }}>
                {location.pathname === "/builds" &&
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 180,
                            bgcolor: "#1e293b",
                            borderRadius: 1
                        }}
                    >
                        <InputLabel sx={{ color: "#94a3b8" }}>Branch</InputLabel>
                        <Select
                            value={["Development"]}
                            label="Select Branch"
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
                            <MenuItem>Main</MenuItem>
                        </Select>
                    </FormControl>
                }
            </Box>
            <Box sx={{ flex: 1 }}></Box>
        </Box >
    )
}

export default HeaderFooter