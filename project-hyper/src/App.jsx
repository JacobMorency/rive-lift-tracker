import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PageHeader from "./components/PageHeader";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { AuthenticatedOnlyRoute } from "./components/AuthenticatedOnlyRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <AuthenticatedOnlyRoute>
              <Layout header={<PageHeader heading="Dashboard" />}>
                <Dashboard />
              </Layout>
            </AuthenticatedOnlyRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthenticatedOnlyRoute>
              <Layout header={<PageHeader heading="Profile" />}>
                <Profile />
              </Layout>
            </AuthenticatedOnlyRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
