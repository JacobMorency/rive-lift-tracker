import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PageHeader from "./components/PageHeader";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import AddWorkoutPage from "./pages/AddWorkoutPage";
import WorkoutsPage from "./pages/WorkoutsPage";
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
          path="/workouts"
          element={
            <AuthenticatedOnlyRoute>
              <Layout header={<PageHeader heading="Workouts" />}>
                <WorkoutsPage />
              </Layout>
            </AuthenticatedOnlyRoute>
          }
        />
        <Route
          path="/add-workout/:workoutId"
          element={
            <AuthenticatedOnlyRoute>
              <Layout header={<PageHeader heading="Add Workout" />}>
                <AddWorkoutPage />
              </Layout>
            </AuthenticatedOnlyRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthenticatedOnlyRoute>
              <Layout header={<PageHeader heading="Profile" />}>
                <ProfilePage />
              </Layout>
            </AuthenticatedOnlyRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
