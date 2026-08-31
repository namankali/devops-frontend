import { Box, Typography } from "@mui/material"
import NavBar from "./navbar"
import { useTheme } from "@mui/system"
import ProfileSection from "../profileSection"
import { UseUserProfile } from "../../hooks/useUserProfile"

const Header: React.FC = () => {
    const theme = useTheme()

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 18
                ? "Good Afternoon"
                : "Good Evening";

    const { data: userData } = UseUserProfile()

    return (
        <Box
            sx={{
                width: "100%",
                height: "8%",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Typography
                    sx={{
                        fontSize: "1.35rem",
                        fontWeight: 700,
                        color: "text.primary",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                    }}
                >
                    {greeting}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.4,
                        fontSize: "0.90rem",
                        color: "text.secondary",
                        letterSpacing: "0.01em",
                    }}
                >
                    Infrastructure, automation & intelligence at a glance.
                </Typography>
            </Box>
            <Box
                sx={{
                    flex: 2,
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <NavBar />
            </Box>
            <Box sx={{
                flex: 1,
                display: "flex",
                justifyContent: "right",
            }}>
                <ProfileSection
                    userProfile={userData}
                />
            </Box>
        </Box >
    )
}

export default Header