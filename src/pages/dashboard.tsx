import { Box } from "@mui/system";
import type React from "react";
import Header from "../components/header";
import { Outlet } from "react-router-dom";
import HeaderFooter from "../components/headerFooter";

const DashBoard: React.FC = () => {
    return (
        <Box sx={{
            height: "100dvh",
            display: "flex",
            flexDirection: "column"
        }}>
            <Header />
            <hr />
            <HeaderFooter />
            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default DashBoard