import { Box } from "@mui/system";
import type React from "react";
import ShieldIcon from "@mui/icons-material/Security";
import { Typography } from "@mui/material";
import type { MessagesObj } from "../../../helper/interfaces";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown"

interface Props {
    messages: MessagesObj,
    onLoadMore: () => void
}

const AssistantBody: React.FC<Props> = ({ messages, onLoadMore }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const shouldAutoScroll = useRef(true)

    const handleScroll = () => {
        const el = containerRef.current
        if (!el) return

        // 🔹 load more (top)
        if (el.scrollTop === 0) {
            const prevHeight = el.scrollHeight
            onLoadMore()

            setTimeout(() => {
                const newHeight = el.scrollHeight
                el.scrollTop = newHeight - prevHeight
            }, 0)
        }

        // 🔹 correct bottom detection
        const threshold = 100
        const isNearBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < threshold

        shouldAutoScroll.current = isNearBottom
    }

    // auto scroll on new messages
    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        if (shouldAutoScroll.current) {
            el.scrollTop = el.scrollHeight
        }
    }, [messages?.messages])

    // initial scroll
    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        el.scrollTop = el.scrollHeight
    }, [])

    if (!messages || messages?.messages?.length === 0) {
        return (
            <Box sx={{
                opacity: 0.2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
            }}>
                <ShieldIcon sx={{ fontSize: 200 }} />
            </Box>
        )
    }

    return (
        <Box
            ref={containerRef}
            onScroll={handleScroll}
            sx={{
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
                px: 2,
                py: 1,
            }}
        >
            {messages.messages.map((msg) => (
                <Box
                    key={msg.id}
                    sx={{
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                        backgroundColor: msg.role === "user" ? "primary.main" : "grey.800",
                        color: msg.role === "user" ? "black" : "white",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        maxWidth: "70%"
                    }}
                >
                    {/* <Typography variant="body2">{msg.content}</Typography> */}
                    <ReactMarkdown>
                        {msg.content}
                    </ReactMarkdown>

                </Box>
            ))}
        </Box>
    )
}

export default AssistantBody