import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { remove_undescore } from "../../helper/format"

interface Props {
    value: string
    handleChange: any,
    menuItems: any,
    purpose?: string,
    label: string,
    disabled?: boolean
}
export const CustomSelect: React.FC<Props> = ({ value, handleChange, menuItems, purpose = "", label, disabled }) => {
    const labelId = `${label}-label`;
    const selectId = `${label}-select`;

    return (
        <FormControl
            size="small"
            disabled={disabled}
            sx={{
                minWidth: 180,
                bgcolor: "#1e293b",
                borderRadius: 1,
                cursor: disabled ? "not-allowed" : "pointer"
            }}
        >
            <InputLabel
                id={labelId}
                shrink={value !== ""}
                sx={{ color: "#94a3b8" }}
            >
                {label}
            </InputLabel>

            <Select
                id={selectId}
                labelId={labelId}
                value={value}
                label={label}
                onChange={handleChange}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            bgcolor: "#1e293b",
                            color: "white",

                            "& .MuiMenuItem-root": {
                                color: "white",
                            },

                            "& .MuiMenuItem-root:hover": {
                                bgcolor: "#334155",
                            },

                            "& .Mui-selected": {
                                bgcolor: "#2575fc !important",
                            },

                            "& .Mui-selected:hover": {
                                bgcolor: "#1d4ed8 !important",
                            },
                        },
                    },
                }}
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
                {purpose === "ns" && (<MenuItem value="all">All</MenuItem>)}
                {menuItems?.map((obj) => (
                    <MenuItem
                        value={obj.name ?? obj.provider ?? obj.display_name ?? obj}
                        key={obj.name ?? obj.id ?? obj}
                    >
                        {obj.name ?? remove_undescore(obj.provider) ?? obj.display_name ?? obj}
                    </MenuItem>
                ))}
            </Select>
        </FormControl >
    )
}