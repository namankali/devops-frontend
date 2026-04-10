import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useState, type ChangeEvent, type FormEvent } from "react";
import useAuthStore from "../helper/infostore";
import Server from "../service/Server";
import Toast from "../utils/toast";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate()

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthStore((state) => state.setAuthenticated)

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name as keyof LoginForm;
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("form", form);
      const login_in_call = await Server.signin(form)
      if (login_in_call.success) {
        setIsAuthenticated(true)
        navigate("/", { replace: true })
        Toast.success("Login Successful!")
      }
    } catch (error: any) {
      console.log("Error check ->>> ", error)
      const message = error?.response?.data?.message || error?.message || "Something went Wrong!"

      Toast.error(message)
    }
  };

  return (
    <Box
      sx={{
        height: "100dvh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `
        linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
        url('https://images.unsplash.com/photo-1508780709619-79562169bc64')
      `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: 350,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 3,
          color: "#fff",
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>

        <Box component="form" onSubmit={submitHandler}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#fff" } }}
            sx={{
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#fff" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ style: { color: "#fff" } }}
            sx={{
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#fff" },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              py: 1.2,
              fontWeight: "bold",
              background: "linear-gradient(45deg, #6a11cb, #2575fc)",
            }}
          >
            Login
          </Button>
        </Box>

        {isAuthenticated && (
          <Typography color="lightgreen" mt={2} textAlign="center">
            Logged in ✅
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Login;