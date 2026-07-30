import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Input,
    Button,
} from "@mui/material";
import { Grid } from "@mui/system";

import CustomSelector from "./CustomSelector";
import CustomAuthenticationSelector from "./CustomAuthenticationSelector";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Server from "../../service/Server";
import Toast from "../../utils/toast";

const authMethods = [
    {
        value: "KUBECONFIG",
        title: "Kubeconfig",
        subtitle: "Upload kubeconfig file",
        icon: <DescriptionOutlinedIcon />,
    },
    {
        value: "SERVICE_ACCOUNT",
        title: "Service Account",
        subtitle: "Use service account token",
        icon: <SecurityOutlinedIcon />,
    },
    {
        value: "AWS_IAM",
        title: "AWS IAM (EKS)",
        subtitle: "Use AWS IAM authentication",
        icon: <CloudOutlinedIcon />,
    },
    {
        value: "TOKEN",
        title: "Token",
        subtitle: "Use bearer token",
        icon: <VpnKeyOutlinedIcon />,
    },
];

interface Props {
    onSuccess?: () => void;
    registerationHandlerClose: any
}

const KubernetesRegisteration: React.FC<Props> = ({
    onSuccess,
    registerationHandlerClose
}) => {
    const [displayName, setDisplayName] = useState("");
    const [providerEnvValue, setProviderEnvValue] = useState({
        provider: "",
        environment: "",
    });

    const [authenticationMethod, setAuthenticationMethod] =
        useState("KUBECONFIG");

    const [kubeconfigFile, setKubeconfigFile] =
        useState<File | null>(null);

    const fileChangeHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files?.length) return;

        setKubeconfigFile(e.target.files[0]);
    };

    const submitHandler = async () => {
        try {
            if (!displayName.trim()) {
                alert("Display Name is required");
                return;
            }

            if (!providerEnvValue.provider) {
                alert("Please select a provider");
                return;
            }

            if (!providerEnvValue.environment) {
                alert("Please select an environment");
                return;
            }

            if (
                authenticationMethod === "KUBECONFIG" &&
                !kubeconfigFile
            ) {
                alert("Please upload a kubeconfig file");
                return;
            }

            const formData = new FormData()

            formData.append("display_name", displayName)
            formData.append("provider", providerEnvValue.provider)
            formData.append("environment", providerEnvValue.environment)
            formData.append("authentication_method", authenticationMethod)
            if (kubeconfigFile) {
                formData.append("kubeconfig", kubeconfigFile);
            }

            console.log("check---->>>>>>>>>", formData);

            await Server.registerKubernetes(formData)

            setDisplayName("")
            setProviderEnvValue({
                provider: "",
                environment: "",
            })
            setAuthenticationMethod("KUBECONFIG")
            setKubeconfigFile(null)

            onSuccess?.()

        } catch (error: any) {
            console.log("Error: ", error)
            Toast.error(error.message)
        }


    }

    const cancelHandler = () => {
        registerationHandlerClose()
    }

    return (
        <Box
            sx={{
                position: "absolute",
                inset: 0,
                zIndex: 2000,

                bgcolor: "rgba(0,0,0,.65)",
                // backdropFilter: "blur(6px)",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                p: 4,
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    width: "100%",
                    maxWidth: 1000,
                    maxHeight: "90vh",

                    overflowY: "auto",

                    borderRadius: 3,

                    bgcolor: "background.paper",

                    p: 4,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    Register Kubernetes Cluster
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                    mb={4}
                >
                    Add a new Kubernetes cluster to start
                    monitoring and managing your resources.
                </Typography>

                <Grid
                    container
                    spacing={3}
                >
                    <Grid size={{ xs: 12 }}>
                        <Box>
                            <Typography mb={1}>
                                Display Name
                            </Typography>

                            <Input
                                fullWidth
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="e.g. Development Cluster"
                            />
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                            }}
                        >
                            {["provider", "environment"].map(
                                (ele, index) => (
                                    <CustomSelector
                                        key={index}
                                        title={ele}
                                        providerEnvValue={providerEnvValue}
                                        setProviderEnvValue={setProviderEnvValue}
                                    />
                                )
                            )}
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography
                            fontWeight={600}
                            mb={2}
                        >
                            Authentication Method
                        </Typography>

                        <Grid
                            container
                            spacing={2}
                        >
                            {authMethods.map((method) => (
                                <Grid
                                    key={method.value}
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                        md: 3,
                                    }}
                                >
                                    <CustomAuthenticationSelector
                                        method={method}
                                        selected={
                                            authenticationMethod ===
                                            method.value
                                        }
                                        setAuthenticationMethod={
                                            setAuthenticationMethod
                                        }
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {authenticationMethod ===
                        "KUBECONFIG" && (
                            <Grid size={{ xs: 12 }}>
                                <Typography
                                    fontWeight={600}
                                    mb={2}
                                >
                                    Upload Kubeconfig
                                </Typography>

                                <Box
                                    sx={{
                                        border:
                                            "1px dashed rgba(255,255,255,.2)",

                                        borderRadius: 3,

                                        bgcolor: "#141A2E",

                                        textAlign: "center",

                                        p: 4,

                                        "&:hover": {
                                            borderColor:
                                                "#6D5DF6",
                                        },
                                    }}
                                >
                                    <CloudUploadOutlinedIcon
                                        sx={{
                                            fontSize: 50,
                                            color: "#6D5DF6",
                                        }}
                                    />

                                    <Typography
                                        mt={2}
                                        fontWeight={600}
                                    >
                                        Drag & Drop kubeconfig
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        mb={3}
                                    >
                                        or click below to browse
                                    </Typography>

                                    <input
                                        hidden
                                        id="kube-upload"
                                        type="file"
                                        accept=".yaml,.yml,.conf"
                                        onChange={
                                            fileChangeHandler
                                        }
                                    />

                                    <label htmlFor="kube-upload">
                                        <Button
                                            component="span"
                                            variant="contained"
                                        >
                                            Browse File
                                        </Button>
                                    </label>

                                    {kubeconfigFile && (
                                        <Box
                                            mt={3}
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            gap={1}
                                        >
                                            <InsertDriveFileOutlinedIcon />

                                            <Typography>
                                                {
                                                    kubeconfigFile.name
                                                }
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        )}

                    <Grid size={{ xs: 12 }}>
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            gap={2}
                        >
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={cancelHandler}
                            >
                                Close
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={submitHandler}
                            >
                                Connect Cluster
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default KubernetesRegisteration;