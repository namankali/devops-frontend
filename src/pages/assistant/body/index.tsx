import { Box } from "@mui/system";
import type React from "react";
import ShieldIcon from "@mui/icons-material/Security";
import { Typography } from "@mui/material";
import type { MessagesObj } from "../../../helper/interfaces";
import { useEffect, useRef, useLayoutEffect } from "react";
import ReactMarkdown from "react-markdown"

interface Props {
    messages: MessagesObj,
    onLoadMore: () => void
}

const AssistantBody: React.FC<Props> = ({ messages, onLoadMore }) => {
    // console.log("messages", messages)
    const containerRef = useRef<HTMLDivElement>(null)
    const shouldAutoScroll = useRef(true)
    const previousScrollHeight = useRef<null | number>(null)
    const loadingOlderMessage = useRef(false)

    const handleScroll = () => {
        const el = containerRef.current
        if (!el) return

        //  load more (top)
        if (el.scrollTop < 5 && !loadingOlderMessage.current) {
            previousScrollHeight.current = el.scrollTop
            loadingOlderMessage.current = true

            onLoadMore()

            return
        }

        // correct bottom detection
        const threshold = 100
        const isNearBottom =
            el.scrollHeight - el.scrollHeight - el.scrollTop - el.clientHeight < threshold

        shouldAutoScroll.current = isNearBottom
    }

    // auto scroll on new messages
    useEffect(() => {
        const el = containerRef.current

        if (!el) return
        if (loadingOlderMessage.current && previousScrollHeight.current !== null) {
            const newScrollHeight = el.scrollHeight

            const heightDiff = newScrollHeight - previousScrollHeight.current
            console.log("scroll height diff ->>>> ", heightDiff)
            el.scrollTop = heightDiff

            previousScrollHeight.current = null
            loadingOlderMessage.current = false

            return
        }

        // New message  scroll to bottom
        if (shouldAutoScroll.current) {
            el.scrollTop = el.scrollHeight
        }

    }, [messages?.messages])

    // initial scroll
    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        console.log("initial el value", el.scrollHeight)
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
            {messages?.messages?.map((msg) => (
                <Box
                    key={msg.id}
                    sx={{
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",

                        backgroundColor:
                            msg.role === "user"
                                ? "primary.main"
                                : "background.paper",

                        color:
                            msg.role === "user"
                                ? "primary.contrastText"
                                : "text.primary",

                        px: 2,
                        py: 1.5,

                        borderRadius:
                            msg.role === "user"
                                ? "18px 18px 4px 18px"
                                : "18px 18px 18px 4px",

                        maxWidth: "70%",
                        width: "fit-content",

                        boxShadow:
                            msg.role === "user"
                                ? "0 2px 6px rgba(0, 0, 0, 0.12)"
                                : "0 2px 6px rgba(0, 0, 0, 0.08)",

                        overflowWrap: "anywhere",

                        "& p": {
                            margin: 0,
                            lineHeight: 1.6,
                            fontSize: "0.95rem",
                        },

                        "& p + p": {
                            marginTop: 1,
                        },

                        "& ul, & ol": {
                            marginTop: 1,
                            marginBottom: 1,
                            paddingLeft: 3,
                        },

                        "& li": {
                            marginBottom: 0.5,
                        },

                        "& strong": {
                            fontWeight: 700,
                        },

                        "& code": {
                            backgroundColor:
                                msg.role === "user"
                                    ? "rgba(255,255,255,0.15)"
                                    : "action.hover",

                            padding: "2px 6px",
                            borderRadius: "5px",
                            fontSize: "0.85em",
                            fontFamily: "monospace",
                        },

                        "& pre": {
                            backgroundColor:
                                msg.role === "user"
                                    ? "rgba(0,0,0,0.15)"
                                    : "grey.900",

                            padding: 1.5,
                            borderRadius: 1.5,
                            overflowX: "auto",
                            marginTop: 1.5,
                            marginBottom: 1,

                            "& code": {
                                backgroundColor: "transparent",
                                padding: 0,
                                color: "inherit",
                            },
                        },

                        "& a": {
                            color:
                                msg.role === "user"
                                    ? "inherit"
                                    : "primary.light",

                            fontWeight: 600,
                            textDecoration: "underline",

                            "&:hover": {
                                opacity: 0.8,
                            },
                        },

                        "& blockquote": {
                            margin: "12px 0",
                            paddingLeft: 1.5,
                            borderLeft: "3px solid",
                            borderColor: "primary.main",
                            opacity: 0.9,
                        },
                    }}
                >
                    <ReactMarkdown>
                        {msg.content}
                    </ReactMarkdown>
                </Box>
            ))}
        </Box>
    )
}

export default AssistantBody