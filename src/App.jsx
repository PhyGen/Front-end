import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes/routes";
import DefaultLayout from "./layouts/defaultLayout/defaultLayout";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from '../src/routes/protectRoutes';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

function AppRoutes() {
  const { user, loading } = useAuth();

  console.log('AppRoutes rendering with user:', user, 'loading:', loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Tạo một mảng chứa tất cả các path hợp lệ
  const validPaths = [
    ...publicRoutes.map(route => route.path),
    ...privateRoutes.map(route => route.path),
    '/', // Thêm path mặc định
  ];

  console.log('Valid paths:', validPaths);
  console.log('Private routes:', privateRoutes);

  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route, index) => {
        const Page = route.component;
        let Layout = DefaultLayout;

        if (route.layout) {
          Layout = route.layout;
        } else if (route.layout === null) {
          Layout = Fragment;
        }

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}

      {/* Private Routes */}
      {privateRoutes.map((route, index) => {
        const Page = route.component;
        let Layout = DefaultLayout;

        console.log('Processing private route:', route.path, 'component:', Page);

        if (route.layout) {
          Layout = route.layout;
        } else if (route.layout === null) {
          Layout = Fragment;
        }

        return (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute>
                <Layout>
                  <Page />
                </Layout>
              </ProtectedRoute>
            }
          />
        );
      })}

      {/* Default Route */}
      <Route
        path="/"
        element={
          user ? <Navigate to="/main" replace /> : <Navigate to="/landing" replace />
        }
      />

      {/* Catch-all route for invalid paths */}
      <Route
        path="*"
        element={
          user ? <Navigate to="/main" replace /> : <Navigate to="/landing" replace />
        }
      />
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
