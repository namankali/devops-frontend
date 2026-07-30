import { Typography } from "@mui/material"
import { Box } from "@mui/system"

interface Props {
    setAuthenticationMethod: any,
    method: Record<string, any>,
    selected: boolean
}

const CustomAuthenticationSelector: React.FC<Props> = ({
    setAuthenticationMethod,
    method,
    selected
}) => {
    return (
        <Box
            onClick={() => setAuthenticationMethod(method.value)}
            sx={{
                cursor: "pointer",
                borderRadius: 1,
                p: 2.5,
                height: 130,

                border: selected
                    ? "2px solid #6D5DF6"
                    : "1px solid rgba(255,255,255,0.12)",

                background: selected
                    ? "rgba(109,93,246,.08)"
                    : "#161B2D",

                transition: ".25s",

                "&:hover": {
                    borderColor: "#6D5DF6",
                    transform: "translateY(-2px)"
                }
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5
                }}
            >
                <Box
                    sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor: selected
                            ? "#6D5DF6"
                            : "grey.500",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    {selected && (
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor: "#6D5DF6"
                            }}
                        />
                    )}
                </Box>

                <Box
                    sx={{
                        color: selected
                            ? "#6D5DF6"
                            : "grey.400"
                    }}
                >
                    {method.icon}
                </Box>

                <Typography
                    fontWeight={600}
                >
                    {method.title}
                </Typography>
            </Box>

            <Typography
                mt={2}
                variant="body2"
                color="text.secondary"
            >
                {method.subtitle}
            </Typography>
        </Box>
    )
}

export default CustomAuthenticationSelector