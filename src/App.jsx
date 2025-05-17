import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes/routes";
import DefaultLayout from "./layouts/defaultLayout/defaultLayout";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from '../src/routes/protectRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  const specifiedRoutes = [...publicRoutes, ...privateRoutes];

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {specifiedRoutes.map((route, index) => {
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
                    route.role ? (
                      <ProtectedRoute role={route.role}>
                        <Layout>
                          <Page />
                        </Layout>
                      </ProtectedRoute>
                    ) : (
                      <Layout>
                        <Page />
                      </Layout>
                    )
                  }
                />
              );
            })}

            {/* Catch-all route for 404 Error Page */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
