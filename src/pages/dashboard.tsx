import { Box } from "@mui/system";
import type React from "react";
import Header from "../components/header";
import { Outlet } from "react-router-dom";
import HeaderFooter from "../components/headerFooter";
import { useEffect, useState } from "react";
import { HeaderFooterContext } from "../helper/headerFooterContext";
import { useLocation } from "react-router-dom";

const DashBoard: React.FC = () => {
    const location = useLocation()
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (location.pathname === "/") setDisabled(false)
    }, [location.pathname])

    return (
        <HeaderFooterContext.Provider value={{
            disabled,
            setDisabled
        }}>
            <Box sx={{
                height: "100dvh",
                display: "flex",
                flexDirection: "column"
            }}>
                <Header />
                <hr />
                {disabled && <HeaderFooter />}
                <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                    <Outlet />
                </Box>
            </Box >
        </HeaderFooterContext.Provider>
    )
}

export default DashBoard