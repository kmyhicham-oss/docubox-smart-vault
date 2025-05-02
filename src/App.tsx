
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import AddDocument from "./pages/AddDocument";
import DocumentDetail from "./pages/DocumentDetail";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Mock authentication check - would be replaced with real authentication
const isAuthenticated = true; 

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <Index /> : <Navigate to="/login" />} />
          <Route path="/documents" element={isAuthenticated ? <Documents /> : <Navigate to="/login" />} />
          <Route path="/documents/:id" element={isAuthenticated ? <DocumentDetail /> : <Navigate to="/login" />} />
          <Route path="/add-document" element={isAuthenticated ? <AddDocument /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
