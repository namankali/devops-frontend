import { useEffect, useState } from "react"
import { flex, Grid, minWidth } from "@mui/system"
import ResourcesSidebar from "./resourcesSideBar"
import ResourcesTableSection from "./resourcesTableSection"
import { useResources } from "../../../hooks/useResources"
import { KubernetesStore } from "../../../helper/useKubernetesStore"
import type { GridColDef } from "@mui/x-data-grid"
import ResourceDetails from "./resourceDetails"
import { formattedDate } from "../../../helper/format"
import CustomSkeleton from "../../customSkeleton"

const MiddleKubernetesSection: React.FC = () => {
    const { selectedResource, selectedNamespace, selectedProvider, selectedEnvironment } = KubernetesStore()

    const { data: resourceData, isLoading } = useResources(
        selectedResource,
        selectedNamespace,
        selectedProvider,
        selectedEnvironment
    )

    const [columns, setColumns] = useState([])
    const [rows, setRows] = useState([])

    useEffect(() => {
        if (!resourceData) return

        const gridColumns: GridColDef[] = resourceData?.columns?.map((field: string) => {
            return {
                field,
                headerName: field.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                flex: 1,
                minWidth: 60
            }
        }) ?? []

        const gridRows = resourceData?.rows?.map((row: any, index: number) => {
            if (row.created) {
                row["created"] = formattedDate(row["created"])
            }

            return {
                id: index,
                ...row
            }
        }) ?? []

        setColumns(gridColumns)
        setRows(gridRows)
    }, [resourceData])

    if (isLoading) {
        return <CustomSkeleton />
    }

    return (
        <Grid
            container spacing={2} sx={{ mb: 1 }}
        >
            <Grid size={{ xs: 12, lg: 3 }}><ResourcesSidebar /></Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
                <ResourcesTableSection
                    rows={rows}
                    columns={columns}
                    isLoading={isLoading}
                />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
                <ResourceDetails

                />
            </Grid>
        </Grid>
    )
}

export default MiddleKubernetesSection