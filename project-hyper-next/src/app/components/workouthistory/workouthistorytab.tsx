"use client";
import { useState, useEffect } from "react";

import WorkoutHistoryCard from "@/app/components/workouthistory/workouthistorycard";

const WorkoutHistoryTab = ({ workouts }) => {
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("week");

  const handleTabChange = (value) => {
    if (value === "week") {
      fetchWeeklyWorkouts();
    }
    if (value === "month") {
      fetchMonthlyWorkouts();
    }
    if (value === "all") {
      fetchAllWorkouts();
    }
  };

  const fetchWeeklyWorkouts = () => {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Set start of the week to Sunday at 00:00
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Set end of the week to Saturday at 23:59
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0); // Also clear time for workout dates
      return (
        workoutDate >= startOfWeek &&
        workoutDate <= endOfWeek &&
        workoutDate.getFullYear() === currentYear
      );
    });

    setSelectedWorkouts(weeklyWorkouts);
  };

  const fetchMonthlyWorkouts = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthlyWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return (
        workoutDate.getMonth() === currentMonth &&
        workoutDate.getFullYear() === currentYear
      );
    });

    setSelectedWorkouts(monthlyWorkouts);
  };

  const fetchAllWorkouts = () => {
    setSelectedWorkouts(workouts);
  };

  useEffect(() => {
    if (workouts.length > 0) {
      fetchWeeklyWorkouts();
    }
  }, [workouts]);

  useEffect(() => {
    if (selectedTab === "week") fetchWeeklyWorkouts();
    else if (selectedTab === "month") fetchMonthlyWorkouts();
    else if (selectedTab === "all") fetchAllWorkouts();
  }, [selectedTab]);

  return (
    <div className="mt-3">
      <div className="flex justify-center">
        <div role="tablist" className="tabs tabs-box bg-secondary">
          <button
            role="tab"
            className={`tab ${selectedTab === "week" ? "tab-active" : ""}`}
            onClick={() => setSelectedTab("week")}
          >
            This Week
          </button>
          <button
            role="tab"
            className={`tab ${selectedTab === "month" ? "tab-active" : ""}`}
            onClick={() => setSelectedTab("month")}
          >
            This Month
          </button>
          <button
            role="tab"
            className={`tab ${selectedTab === "all" ? "tab-active" : ""}`}
            onClick={() => setSelectedTab("all")}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-4 pb-24">
        {selectedWorkouts.length > 0 ? (
          selectedWorkouts.map((workout) => (
            <WorkoutHistoryCard key={workout.id} workout={workout} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">
            {selectedTab === "week" && "No workouts this week."}
            {selectedTab === "month" && "No workouts this month."}
            {selectedTab === "all" && "No workouts yet."}
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistoryTab;
