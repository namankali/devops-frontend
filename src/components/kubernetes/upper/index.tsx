import { Button, Typography, type SelectChangeEvent } from "@mui/material"
import { Box, Grid, useTheme } from "@mui/system"
import CustomCard from "../../../pages/home/components/customCards"
import { CustomSelect } from "../../customSelect"
import { useState } from "react"
import { remove_undescore, UpperCaseFirstLetter } from "../../../helper/format"



interface _UpperKubernetesSection {
    namespace: string,
    setNamespace: any,
    provider: string,
    setProvider: any,
    environment: string,
    setEnvironment: any,
    environments: string[],
    namespaces: any,
    setNamespaces: any,
    providers: string[]
    kubeInfo: any,
    refetch: any,
    handleApplyHandler: any,
    cluster_name: string,
    registerationHandler: any,
    isNamespaceDisabled: boolean
    setIsNamespaceDisabled: any,
    setIsEnvironmentDisabled: any,
    isEnvironmentDisabled: boolean,
    selectedProvider: string
}

const UpperKubernetesSection: React.FC<_UpperKubernetesSection> = ({
    namespace,
    setNamespace,
    namespaces,
    environments,
    provider,
    setProvider,
    environment,
    setEnvironment,
    providers,
    kubeInfo,
    handleApplyHandler,
    refetch,
    cluster_name,
    registerationHandler,
    isNamespaceDisabled,
    setIsNamespaceDisabled,
    isEnvironmentDisabled,
    setIsEnvironmentDisabled,
    selectedProvider
}) => {
    // const [isApplyDisabled, setIsApplyDisabled] = useState(true);
    const handleProviderChange = (e: SelectChangeEvent) => {
        const provider = e.target.value

        // const filteredProvider = providers.find((obj)=> obj?.display_name === provider)

        setProvider(provider)

        setNamespace("")
        setEnvironment("")

        // setIsEnvironmentDisabled(false)
    }

    const handleEnvironmentChange = (e: SelectChangeEvent) => {
        const environment = e.target.value

        setEnvironment(environment)
        setNamespace("")
        // setIsNamespaceDisabled(false)
    }

    const handleNamespaceChange = (e: SelectChangeEvent) => {
        const ns = e.target.value

        setNamespace(ns)

        // setIsApplyDisabled(false)
    }

    const handleRefresh = () => {
        refetch()
    }

    const theme = useTheme()

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Typography variant="h6" color={theme.palette.text.primary} fontWeight="bold">{UpperCaseFirstLetter(cluster_name)} ({remove_undescore(selectedProvider)})</Typography>
                <Box sx={{
                    mr: "4dvh",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2
                    // width: "30dvh"
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center"
                        }}
                    >
                        <CustomSelect
                            value={provider}
                            handleChange={handleProviderChange}
                            menuItems={providers}
                            label="Provider"
                        />
                        <CustomSelect
                            value={environment}
                            handleChange={handleEnvironmentChange}
                            menuItems={environments}
                            label="Environment"
                            disabled={isEnvironmentDisabled}
                        />
                        <CustomSelect
                            value={namespace}
                            handleChange={handleNamespaceChange}
                            menuItems={namespaces}
                            purpose="ns"
                            label="Namespace"
                            disabled={isNamespaceDisabled}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        // disabled={isApplyDisabled}
                        sx={{
                            py: 1.2,
                            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
                            color: "white",
                            fontWeight: "bold",
                            // cursor: isApplyDisabled ? "not-allowed" : "pointer",

                            "&:disabled": {
                                cursor: "not-allowed",
                                background: "#475569",
                                color: "#94a3b8",
                            },
                        }}
                        onClick={handleApplyHandler}
                    >
                        Apply
                    </Button>
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
                    <Button
                        variant="contained"
                        sx={{
                            py: 1.2,
                            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
                            color: "white",
                            fontWeight: "bold",
                        }}
                        onClick={registerationHandler}
                    >
                        Register New Cluster
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