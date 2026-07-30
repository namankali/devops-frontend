import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Box, useTheme } from "@mui/system"
import { KubernetesStore } from "../../../helper/useKubernetesStore"
import { UseKubernetesEvents } from "../../../hooks/useKubernetesEvents"

const RecentEvents: React.FC = () => {
    const { selectedNamespace } = KubernetesStore()
    const { data: eventDetails, isLoading } = UseKubernetesEvents(selectedNamespace)

    const theme = useTheme()
    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                p: 1,
                color: theme.palette.text.primary,
                height: "100%"
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Recent Events</Typography>

            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 260,
                    backgroundColor: theme.palette.background.paper,

                    "&::-webkit-scrollbar": {
                        width: 8,
                    },

                    "&::-webkit-scrollbar-track": {
                        background: theme.palette.background.default,
                        borderRadius: 8,
                    },

                    "&::-webkit-scrollbar-thumb": {
                        background: theme.palette.primary.main,
                        borderRadius: 8,
                    },

                    "&::-webkit-scrollbar-thumb:hover": {
                        background: theme.palette.primary.dark,
                    },

                    // Firefox
                    scrollbarWidth: "thin",
                    scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.default}`,
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {["Type", "Information", "Timestamp"].map((ele) => (
                                <TableCell
                                    key={ele}
                                    sx={{
                                        backgroundColor: theme.palette.background.default,
                                        fontWeight: "bold"
                                    }}
                                >
                                    {ele}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {eventDetails?.map((row) => {
                            return (
                                <TableRow
                                    key={row.id}
                                    hover
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: theme.palette.primary.main
                                        }
                                    }}
                                >
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.message}</TableCell>
                                    <TableCell>{row.last_timestamp}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default RecentEvents