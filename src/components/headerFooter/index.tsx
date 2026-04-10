import { Box } from "@mui/system";
import type React from "react";
import { Button, useTheme } from "@mui/material";
import Icons from "../icons"
const HeaderFooter: React.FC = () => {
    const theme = useTheme()
    const backHandler = () => {
        console.log("back handler is clicked")
    }
    return (
        <Box
            sx={{
                p: 1,
                display: "flex",
                flexDirection: "row",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                justifyContent: "space-between"
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Button
                    startIcon={<Icons.ArrowBackIcon />}
                    onClick={backHandler}
                >Back</Button>
            </Box>
            <Box sx={{ flex: 1 }}></Box>
        </Box>
    )
}

export default HeaderFooter