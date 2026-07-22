import { Tab, Tabs } from "@mui/material"
import { useState } from "react"

interface Props {
    tab: number,
    setTab: any
}

export const CustomTabResources: React.FC<Props> = ({ tab, setTab }) => {
    return (
        <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
        >
            <Tab label="Overview" sx={{ fontWeight: "bold" }} />
            <Tab label="YAML" sx={{ fontWeight: "bold" }} />
            <Tab label="Metrics" sx={{ fontWeight: "bold" }} />
        </Tabs>
    )
}