import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./styles/index.css";
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from "./theme/index.ts"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <Toaster
          position='top-right'
          toastOptions={{
            duration: 4000
          }}
        />
        <App />
      </BrowserRouter >
    </ThemeProvider>
  </QueryClientProvider>
)
