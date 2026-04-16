import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./styles/index.css";
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from "./theme/index.ts"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter >
    </ThemeProvider>
  </QueryClientProvider>
)
