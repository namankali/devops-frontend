import { capitalize, FormControl, InputLabel, MenuItem, Select, Typography, type SelectChangeEvent } from "@mui/material"
import { Box } from "@mui/system"
import { useState } from "react"

interface Props {
    title: string,
    providerEnvValue: Record<string, string>,
    setProviderEnvValue: any
}

const provider_info = ["Local Kubernetes", "AWS EC2 K3S", "AWS EKS", "AZURE AKS", "GCP GKS"]
const environment_info = ["Development", "Staging", "Production"]
const CustomSelector: React.FC<Props> = ({ title, providerEnvValue, setProviderEnvValue }) => {
    console.log("selctor is not working", title, providerEnvValue)
    const selectorHandler = (e: SelectChangeEvent) => {
        setProviderEnvValue((prev: Record<string, string>) => {
            return {
                ...prev,
                [title]: e.target.value
            }
        })
    }
    const selectedMenuValues = title === "provider" ? provider_info : environment_info
    return (
        <Box sx={{ flex: 1, display: "flex", gap: 2, flexDirection: "column" }}>
            <Typography>{capitalize(title)}</Typography>
            <FormControl size="medium" sx={{
                minWidth: 180,
                bgcolor: "#1e293b",
                // bgcolor: "white",
                borderRadius: 1
            }}>
                {/* <InputLabel></InputLabel> */}
                <Select
                    value={providerEnvValue[title]}
                    onChange={selectorHandler}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                // zIndex: 3000
                                bgcolor: "black"
                            }
                        },
                        disablePortal: true,
                        marginThreshold: 0
                    }}
                >
                    {selectedMenuValues.map((ele, index) => {
                        return (
                            <MenuItem key={index} value={ele}>{ele}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </Box>
    )
}

export default CustomSelector