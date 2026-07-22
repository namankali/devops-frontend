import { Button, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material"
import { Box, Grid } from "@mui/system"
import CustomCard from "../../../pages/home/components/customCards"
import { useQueryClient } from "@tanstack/react-query"



interface _UpperKubernetesSection {
    namespace: string,
    setNamespace: any,
    namespaces: any,
    setNamespaces: any,
    kubeInfo: any,
    refetch: any
}

const UpperKubernetesSection: React.FC<_UpperKubernetesSection> = ({ namespace, setNamespace, namespaces, kubeInfo, refetch }) => {
    const queryClient = useQueryClient()
    const handleNamespaceChange = (e: SelectChangeEvent) => {
        const ns = e.target.value

        setNamespace(ns)
        queryClient.invalidateQueries({
            queryKey: ["kuberentes_resources"]
        })
    }

    const handleRefresh = () => {
        refetch()
    }

    return (
        <Box sx={{ flex: 1 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    alignItems: "center",
                    flexWrap: "wrap"
                }}
            >
                <Box>Kubernetes Cluster</Box>
                <Box sx={{
                    mr: "4dvh",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "30dvh"
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center"
                        }}
                    >
                        <FormControl
                            size="small"
                            sx={{
                                minWidth: 180,
                                bgcolor: "#1e293b",
                                borderRadius: 1
                            }}
                        >
                            <InputLabel sx={{ color: "#94a3b8" }}> Namespace</InputLabel>

                            <Select
                                value={namespace}
                                label="Namespace"
                                onChange={handleNamespaceChange}
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
                                <MenuItem value="all">All</MenuItem>
                                {namespaces.map((obj) => (
                                    <MenuItem value={obj.name} key={obj.name}>{obj.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            py: 1.2,
                            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
                            color: "white",
                            fontWeight: "bold",
                        }}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Cards */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {kubeInfo.map((item) => {
                    const Icon = item.icon

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={item.title}>
                            <CustomCard
                                item={item}
                                kubernetes={true}
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}

export default UpperKubernetesSection