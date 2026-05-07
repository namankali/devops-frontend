import type React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { FolderGit, X } from "lucide-react";
import CustomDialog from "../../../components/customDialog";

type Repo = {
  name: string;
  type: string;
  owner: string;
  branch: string;
  build: string;
  prs: number;
  deploy: string;
  security: string;
  activity: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  repos: Repo[];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Success":
    case "Low":
      return "success";
    case "Failed":
    case "High":
      return "error";
    case "Running":
    case "Medium":
      return "warning";
    case "In Progress":
      return "info";
    default:
      return "default";
  }
};

const RepoDetailsDialog: React.FC<Props> = ({ open, onClose, repos }) => {
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1.5,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={900}>
            Repository Details
          </Typography>
          <Typography fontSize={14} color="#94a3b8">
            Brief overview of connected repositories
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: "#94a3b8",
            border: "1px solid #1e293b",
            "&:hover": {
              color: "#fff",
              background: "rgba(239,68,68,0.16)",
              borderColor: "#ef4444",
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: "#1e293b" }} />

      <DialogContent sx={{ pt: 2.5 }}>
        <Grid container spacing={2}>
          {repos.map((repo) => (
            <Grid size={{ xs: 12, sm: 6 }} key={repo.name}>
              <Card
                sx={{
                  background: "rgba(15, 23, 42, 0.72)",
                  border: "1px solid #1e293b",
                  borderRadius: 3,
                  color: "#e5e7eb",
                  height: "100%",
                  transition: "0.25s ease",
                  "&:hover": {
                    borderColor: "#00d5ff",
                    boxShadow: "0 0 24px rgba(0, 213, 255, 0.12)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(0,213,255,0.12)",
                        color: "#00d5ff",
                      }}
                    >
                      <FolderGit size={22} />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={800} noWrap>
                        {repo.name}
                      </Typography>
                      <Typography fontSize={13} color="#94a3b8">
                        {repo.owner} / {repo.branch}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    <Chip size="small" label={repo.type} color="info" />
                    <Chip
                      size="small"
                      label={`Build: ${repo.build}`}
                      color={getStatusColor(repo.build)}
                    />
                    <Chip
                      size="small"
                      label={`Security: ${repo.security}`}
                      color={getStatusColor(repo.security)}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography fontSize={12} color="#94a3b8">
                        Open PRs
                      </Typography>
                      <Typography fontWeight={800}>{repo.prs}</Typography>
                    </Box>

                    <Box>
                      <Typography fontSize={12} color="#94a3b8">
                        Deploy
                      </Typography>
                      <Typography fontWeight={800}>{repo.deploy}</Typography>
                    </Box>

                    <Box>
                      <Typography fontSize={12} color="#94a3b8">
                        Activity
                      </Typography>
                      <Typography fontWeight={800}>{repo.activity}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </CustomDialog>
  );
};

export default RepoDetailsDialog;