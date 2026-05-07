import { Box } from "@mui/system";
import type React from "react";
import { useTheme } from "@mui/material";
import AssistantHeader from "./header";
import AssistantBody from "./body";
import AssitantInput from "./input";
import useChats from "../../hooks/useChats";
import type { StartConvo } from "../../helper/interfaces";
import Server from "../../service/Server";

const Assistant: React.FC = () => {
    const theme = useTheme();

    const { data, setData, refetch, setQueryData, hasMore, loading } = useChats();

    // Load older messages (scroll up)
    const handleLoadMore = () => {
        if (loading || !hasMore) return;

        setQueryData((prev) => ({
            ...prev,
            offset: prev.offset + prev.limit,
        }));
    };

    // Send message (optimistic UI)
    const handleSend = async (text: string) => {
        if (!data?.conversation_id) {
            await Server.start_convo({ message: text } as StartConvo)
            await refetch()
            return
        }

        const userMessage = {
            id: Date.now(),
            conversation_id: data.conversation_id,
            role: "user",
            content: text,
            status: "completed",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const loadingMessage = {
            id: Date.now() + 1,
            conversation_id: data.conversation_id,
            role: "assistant",
            content: "Typing...",
            status: "loading",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setData((prev) => ({
            ...prev,
            messages: [...(prev?.messages || []), userMessage, loadingMessage],
        }));

        try {
            const res = await Server.new_chat({
                conversation_id: data.conversation_id,
                message: text,
            });

            setData((prev) => ({
                ...prev,
                messages: prev.messages.map((msg) =>
                    msg.status === "loading"
                        ? {
                            ...msg,
                            content: res?.data?.message || "No response",
                            status: "completed",
                        }
                        : msg
                ),
            }));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading && !data?.messages) {
        return <Box p={2}>Loading...</Box>;
    }

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
            }}
        >
            <AssistantHeader />

            <Box
                sx={{
                    flex: 1,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <AssistantBody
                    messages={data}
                    onLoadMore={handleLoadMore}
                />
            </Box>

            <AssitantInput onSend={handleSend} />
        </Box>
    );
};

export default Assistant;