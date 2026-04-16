import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";

const App: React.FC = () => {
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <AppRoutes />

    </>
  )
}

export default App
