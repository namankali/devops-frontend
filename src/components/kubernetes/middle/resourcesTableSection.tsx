import { capitalize, Card, CardContent, TextField, Typography } from "@mui/material"
import { KubernetesStore } from "../../../helper/useKubernetesStore"
import { Box, useTheme } from "@mui/system"
import { DataGrid, type GridColDef, type GridRowParams } from "@mui/x-data-grid";
interface Props {
    rows: any[],
    columns: GridColDef[],
    isLoading: false
}
const ResourcesTableSection: React.FC<Props> = ({ rows, columns, isLoading }) => {
    const theme = useTheme()
    const { selectedResource, setSelectedItem, selectedItem } = KubernetesStore()
    const rowClickHandler = (params: GridRowParams) => {
        setSelectedItem(params.row)
    }

    return (
        <Card sx={{
            height: "100%",
            backgroundColor: "transparent"
        }}>
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    p={2}
                >
                    <Typography fontWeight={600} variant="h6">{capitalize(selectedResource)}</Typography>
                    <TextField size="small" placeholder={`Search ${selectedResource}`} />
                </Box>

                {rows.length === 0
                    ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100%" }}>
                        <Typography fontWeight="bold" variant="h4" color={theme.palette.text.secondary}>No Data Available</Typography>
                    </Box>
                    : <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={isLoading}
                        onRowClick={rowClickHandler}
                        // disableRowSelectionOnClick
                        pageSizeOptions={[10, 15, 25]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 6
                                }
                            }
                        }}
                        sx={{
                            border: 0,
                            backgroundColor: "transparent",
                            cursor: "pointer",

                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "background.paper",
                            },

                            "& .MuiDataGrid-cell": {
                                borderBottom: "1px solid rgba(255,255,255,.08)",
                            },

                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "rgba(255,255,255,.03)",
                            },
                        }}
                    />}
            </CardContent>
        </Card>
    )
}

export default ResourcesTableSection