import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import type React from "react";
import { useState } from "react";

interface Props {
    onSend: (messsage: string) => void
}

const AssitantInput: React.FC<Props> = ({ onSend }) => {
    const [value, setValue] = useState("")

    const submitMessageHandler = () => {
        if (!value.trim()) return;

        onSend(value)
        setValue("")
    }
    return (
        <Box
            sx={{
                p: 2,
                borderTop: "1px solid #1e293b",
                display: "flex",
                gap: 2,
            }}
        >
            <TextField
                value={value}
                onChange={(e) => setValue(e.target.value)}
                fullWidth
                multiline
                minRows={1}
                maxRows={4}
                placeholder="Ask about the flag!"
                sx={{
                    background: "#020617",
                    borderRadius: 2,
                    input: { color: "white" },
                }}
            />
            <Button
                variant="contained"
                sx={{
                    px: 4,
                    borderRadius: 2,
                    background: "linear-gradient(90deg, #14b8a6, #3b82f6)",
                }}
                onClick={submitMessageHandler}
            >
                Send
            </Button>
        </Box>
    )
}

export default AssitantInput