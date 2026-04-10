import { Box } from "@mui/material"
import NavBar from "./navbar"
import { useTheme } from "@mui/system"

interface Props { }
const Header: React.FC = (props: Props) => {
    const theme = useTheme()
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
            <Box
                sx={{
                    flex: 1
                }}
            >AI DEVOPS</Box>
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
            }}>B2</Box>
        </Box>
    )
}

export default Header