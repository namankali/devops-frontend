import { Box } from "@mui/system";
import { Route, Routes, Navigate } from "react-router-dom";
import DashBoard from "../pages/dashboard";
import Login from "../pages/login";
import useAuthStore from "../helper/infostore";
import Home from "../pages/home";
import Builds from "../pages/builds";

const AppRoutes = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <Box>
            <Routes>
                {/* Login route */}
                <Route
                    path="/login"
                    element={
                        !isAuthenticated ? <Login /> : <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/"
                    element={
                        isAuthenticated ? <DashBoard /> : <Navigate to="/login" replace />
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="builds" element={<Builds />} />
                    <Route />
                </Route>
            </Routes>
        </Box>
    );
};

export default AppRoutes;