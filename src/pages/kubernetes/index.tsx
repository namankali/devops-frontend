import { Box, Card, CardContent, LinearProgress, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, Skeleton } from "@mui/material";
import { Cylinder, Wrench, Boxes, Workflow, Box as LucidBox, Rocket } from "lucide-react";
import type { KubernetesStats } from "../../helper/interfaces";

import useKubernetesInfo from "../../hooks/useKubernetesInfo";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Server from "../../service/Server";
import UpperKubernetesSection from "../../components/kubernetes/upper";
import MiddleKubernetesSection from "../../components/kubernetes/middle";
import { KubernetesStore } from "../../helper/useKubernetesStore";
import LowerKubernetesSection from "../../components/kubernetes/lower";
import KubernetesRegisteration from "../../components/kubernetesRegisteration";
import CustomSkeleton from "../../components/customSkeleton";
import Toast from "../../utils/toast";
import { useEnvironments } from "../../hooks/useEnvironment";
import { useDefaultClusterDetails } from "../../hooks/useDefaultClusterDetails";
import { add_undescore } from "../../helper/format";
const stats: KubernetesStats[] = [
    {
        title: "clusters",
        value: 0,
        sub_value: 0,
        icon: Boxes,
        color: "#00d5ff"
    },
    {
        title: "nodes",
        value: 0,
        sub_value: 0,
        icon: Workflow,
        color: "#8b5cf6"
    },
    {
        title: "pods",
        value: 0,
        sub_value: 0,
        icon: LucidBox,
        color: "#ef4444"
    },
    {
        title: "deployments",
        value: 0,
        sub_value: 0,
        icon: Rocket,
        color: "#f59e0b"
    },
    {
        title: "services",
        value: 0,
        sub_value: 0,
        icon: Wrench,
        color: "#06b6d4"
    },
    {
        title: "persistent Volumes",
        value: 0,
        sub_value: 0,
        icon: Cylinder,
        color: "#8b5cf6"
    }
]
const Kubernetes: React.FC = () => {
    const queryClient = useQueryClient()
    const {
        data: defaultClusterData,
        isLoading: defaultClusterLoading
    } = useDefaultClusterDetails()

    const {
        data: environmentsData
    } = useEnvironments();

    const {
        selectedNamespace,
        setSelectedNamespace,
        selectedProvider,
        setSelectedProvider,
        selectedEnvironment,
        setSelectedEnvironment,
        setSelectedDisplayName,
        selectedDisplayName
    } = KubernetesStore();


    const currentProvider =
        selectedProvider || defaultClusterData?.[0]?.provider || "";

    const currentEnvironment =
        selectedEnvironment || defaultClusterData?.[0]?.environment || "";

    const currentNamespace =
        selectedNamespace || "all";

    const {
        data: kubeInfoAPI,
        refetch,
        isLoading,
    } = useKubernetesInfo(
        currentNamespace,
        currentProvider,
        currentEnvironment,
        !defaultClusterLoading && !!defaultClusterData?.length && !!currentProvider && !!currentEnvironment
    );

    const [kubeInfo, setKubeInfo] = useState(stats);
    const [registered, setRegistered] = useState<boolean | null>(null);

    const [provider, setProvider] = useState(selectedProvider);
    const [environment, setEnvironment] = useState(selectedEnvironment);
    const [namespace, setNamespace] = useState("");

    const [providers, setProviders] = useState<any[]>([]);
    const [namespaces, setNamespaces] = useState<any[]>([]);
    const environments =
        environmentsData?.[0].environments ?? [];

    const [isNamespaceDisabled, setIsNamespaceDisabled] = useState(selectedNamespace === "" ? true : false);
    const [isEnvironmentDisabled, setIsEnvironmentDisabled] = useState(selectedEnvironment ? true : false);

    const handleApplyHandler = () => {
        setSelectedProvider(provider);
        setSelectedEnvironment(environment);
        setSelectedNamespace(namespace);

        const cluster = providers.find(
            (item: any) =>
                item.provider === add_undescore(provider) &&
                item.environment === environment
        );

        if (cluster) {
            setSelectedDisplayName(cluster.display_name);
        }
    };

    useEffect(() => {
        const checkRegistration = async () => {
            try {
                const response = await Server.registerationInfo();

                if (!response.data?.length) {
                    setRegistered(false);
                    return;
                }

                setRegistered(true);

                const providersResponse =
                    await Server.providerEnvironmentInfo();

                setProviders(
                    providersResponse.data.map((obj: any) => ({
                        id: obj.id,
                        provider: obj.providers,
                        environment: obj.environments,
                        display_name: obj.display_name,
                    }))
                );
            } catch (error: any) {
                console.error(error);
                Toast.error(error.message);
            }
        };

        checkRegistration();
    }, []);

    useEffect(() => {
        if (!kubeInfoAPI.data) return;

        setKubeInfo((prev) =>
            prev.map((obj) => {
                const apiCard = kubeInfoAPI.data.find(
                    (item) => item.title === obj.title
                );

                if (!apiCard) return obj;

                return {
                    ...obj,
                    value: apiCard.value,
                    sub_value: apiCard.sub_value,
                };
            })
        );
    }, [kubeInfoAPI]);

    useEffect(() => {
        if (!registered) return;
        if (!defaultClusterData?.length) return;

        const initializeCluster = async () => {
            try {
                const cluster = defaultClusterData[0];

                // Zustand (Applied filters)
                setSelectedProvider(cluster.provider);
                setSelectedEnvironment(cluster.environment);
                setSelectedDisplayName(cluster.display_name);
                setSelectedNamespace("all");

                // Local state (Draft filters)
                setProvider(cluster.provider);
                setEnvironment(cluster.environment);
                setNamespace("all");

                const nsResponse = await Server.namespacesInfo(
                    cluster.provider,
                    cluster.environment
                );

                setNamespaces(
                    nsResponse.data.map((item: any) => item.name)
                );

                setIsEnvironmentDisabled(false);
                setIsNamespaceDisabled(false);
            } catch (error) {
                console.error(error);
                Toast.error("Failed to initialize cluster");
            }
        };

        initializeCluster();
    }, [registered, defaultClusterData]);

    useEffect(() => {
        if (!provider || !environment) return;

        const fetchNamespaces = async () => {
            try {
                const response = await Server.namespacesInfo(
                    provider,
                    environment
                );

                setNamespaces(
                    response.data.map((item: any) => item.name)
                );

                setNamespace("all");
                setIsNamespaceDisabled(false);
            } catch (error) {
                console.error(error);
                Toast.error("Failed to fetch namespaces");
            }
        };

        fetchNamespaces();
    }, [provider, environment]);

    if (registered === null) {
        return <CustomSkeleton />;
    }

    const registerationHandler = () => {
        setRegistered(false)
    }
    const registerationHandlerClose = () => {
        setRegistered(true)
    }

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                color: "#e5e7eb",
                background:
                    "radial-gradient(circle at top left, #10233f 0%, #07111f 38%, #050b14 100%)",
                p: { xs: 2, md: 3 },
                gap: 2,
                overflow: "hidden",
            }}
        >
            {/* Tab content */}

            <Box sx={{ flex: 1 }}>
                <UpperKubernetesSection
                    cluster_name={selectedDisplayName}
                    selectedProvider={selectedProvider}
                    refetch={refetch}
                    namespace={namespace}
                    setNamespace={setNamespace}
                    kubeInfo={kubeInfo}
                    namespaces={namespaces}
                    setNamespaces={setNamespaces}
                    provider={provider}
                    setProvider={setProvider}
                    environment={environment}
                    setEnvironment={setEnvironment}
                    handleApplyHandler={handleApplyHandler}
                    environments={environments || []}
                    providers={providers}
                    registerationHandler={registerationHandler}
                    isNamespaceDisabled={isNamespaceDisabled}
                    setIsNamespaceDisabled={setIsNamespaceDisabled}
                    isEnvironmentDisabled={isEnvironmentDisabled}
                    setIsEnvironmentDisabled={setIsEnvironmentDisabled}
                />
            </Box>

            <Box sx={{ flex: 3 }}>
                <MiddleKubernetesSection />
            </Box>

            <Box sx={{ flex: 2 }}>
                <LowerKubernetesSection />
            </Box>

            {/* Registration Overlay */}
            {!registered && (<KubernetesRegisteration
                registerationHandlerClose={registerationHandlerClose}
                onSuccess={async () => {
                    setRegistered(true)

                    const nsApi = await Server.namespacesInfo();
                    setNamespaces(nsApi.data);

                    await Promise.all([
                        refetch(),
                        queryClient.invalidateQueries({
                            queryKey: ["kuberentes_resources"]
                        }),
                        queryClient.invalidateQueries({
                            queryKey: ["pod-usage"]
                        }),
                        queryClient.invalidateQueries({
                            queryKey: ["event-details"]
                        })
                    ])
                }}
            />)}
        </Box>
    );
};

export default Kubernetes;