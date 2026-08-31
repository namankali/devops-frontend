import { TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"

interface Props {
    heading: string,
    placeholder: string,
    footer: string
}

const CustomSAInputs: React.FC<Props> = ({ heading, placeholder, footer }) => {
    return (
        <Box sx={{ flex: 1, display: "flex", gap: 2, flexDirection: "column" }}>
            <Typography>{heading}</Typography>
            <TextField
                placeholder={placeholder}
                sx={{ bgcolor: "#1e293b" }}
            />
            <Typography>{footer}</Typography>
        </Box>
    )
}

export default CustomSAInputs