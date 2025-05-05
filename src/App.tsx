
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
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected route component that checks authentication
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // While checking authentication status, we can show a loading state
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }
  
  return isAuthenticated ? element : <Navigate to="/signin" />;
};

// Routes configuration component, needs to be inside AuthProvider
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If still loading auth state, return nothing to prevent flash
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }
  
  return (
    <Routes>
      <Route path="/signin" element={isAuthenticated ? <Navigate to="/" /> : <SignIn />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
      <Route path="/login" element={<Navigate to="/signin" />} /> {/* Redirect old route to new */}
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute element={<Index />} />} />
      <Route path="/documents" element={<ProtectedRoute element={<Documents />} />} />
      <Route path="/documents/:id" element={<ProtectedRoute element={<DocumentDetail />} />} />
      <Route path="/add-document" element={<ProtectedRoute element={<AddDocument />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
