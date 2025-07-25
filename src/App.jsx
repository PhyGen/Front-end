import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { publicRoutes, privateRoutes } from "./routes/routes";
import DefaultLayout from "./layouts/defaultLayout/defaultLayout";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from '../src/routes/protectRoutes';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import CardDetail from './components/CardDetail';
import { Outlet } from 'react-router-dom';
import { Dialog, DialogContent } from './components/ui/dialog';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DataDeletion from './pages/DataDeletion';
import MainScreen from './pages/MainScreen';
import ModLayout from './pages/Mod/ModLayout';
import Admin from './pages/Admin/Admin';

function CardDetailModal() {
  // Nếu location.state?.background tồn tại, hiển thị modal, ngược lại render CardDetail như trang riêng
  return (
    <Dialog open={true} onOpenChange={() => window.history.back()}>
      <DialogContent className="max-w-3xl w-full">
        <CardDetail />
      </DialogContent>
    </Dialog>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  console.log('AppRoutes rendering with user:', user, 'loading:', loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/data-deletion" element={<DataDeletion />} />

      {/* Private Routes - Nested */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <Outlet />
            </DefaultLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<MainScreen />} />
        <Route path="home" element={<MainScreen />} />
        <Route path="myexam" element={<MainScreen />} />
        <Route path="myexam/:id" element={<CardDetail />} />
        <Route path="recently" element={<MainScreen />} />
        <Route path="trashcan" element={<MainScreen />} />
        <Route path="pgvideo" element={<MainScreen />} />
        <Route path="create" element={<MainScreen />} />
        <Route path="card-detail/:itemId" element={<CardDetail />} />
      </Route>

      {/* Các route khác nếu có */}
      <Route path="/mod" element={<ProtectedRoute><ModLayout /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

      {/* Default Route */}
      <Route path="*" element={<Navigate to={user ? "/" : "/landing"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <ThemeProvider>
            <div className="App">
              <AppRoutes />
            </div>
          </ThemeProvider>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
