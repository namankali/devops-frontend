import { capitalize, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import type { ReactNode } from "react"

interface CustomListItemProps {
    icon?: ReactNode,
    name: string,
    onClick: React.MouseEventHandler<HTMLDivElement>,
    selected: boolean
}

const CustomListItem: React.FC<CustomListItemProps> = (props) => {
    return (
        <ListItemButton
            onClick={props.onClick}
            selected={props.selected}
            sx={{
                textTransform: "capitalize",
                borderRadius: "12px",
                // px: 3,
                // py:1.2,
                mx: 1,
                backdropFilter: "blur(6px)"
            }}
        >
            {props.icon && (
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
            )}
            <ListItemText
                primary={capitalize(props.name)}
            />
        </ListItemButton>
    )
}

export default CustomListItem