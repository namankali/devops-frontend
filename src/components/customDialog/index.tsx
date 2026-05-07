import { Dialog } from "@mui/material"
import type React from "react";

interface CustomDialogProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode
}

const CustomDialog: React.FC<CustomDialogProps> = ({ children, open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    background:
                        "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(2,8,23,0.98))",
                    color: "#e5e7eb",
                    borderRadius: 1,
                    border: "1px solid #1e293b",
                    boxShadow: "0 30px 100px rgba(0,0,0,0.65)",
                },
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: "rgba(2, 6, 23, 0.72)",
                    backdropFilter: "blur(8px)",
                },
            }}
        >
            {children}
        </Dialog>
    )
}

export default CustomDialog