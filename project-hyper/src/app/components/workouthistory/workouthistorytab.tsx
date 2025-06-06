"use client";

import { useState, useEffect } from "react";
import WorkoutHistoryCard from "@/app/components/workouthistory/workouthistorycard";

import { Workout } from "@/types/workout";

type WorkoutHistoryTabProps = {
  workouts: Workout[];
};

const WorkoutHistoryTab = ({ workouts }: WorkoutHistoryTabProps) => {
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("week");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (workouts.length === 0) {
      return;
    }

    setLoading(true);

    const fetchWeeklyWorkouts = (): void => {
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
      setLoading(false);
    };

    const fetchMonthlyWorkouts = (): void => {
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
      setLoading(false);
    };

    const fetchAllWorkouts = (): void => {
      setSelectedWorkouts(workouts);
      setLoading(false);
    };

    if (selectedTab === "week") fetchWeeklyWorkouts();
    else if (selectedTab === "month") fetchMonthlyWorkouts();
    else if (selectedTab === "all") fetchAllWorkouts();
  }, [workouts, selectedTab]);

  return (
    <div className="mt-3">
      <div className="flex justify-center">
        <div role="tablist" className="tabs tabs-box bg-base-300 shadow-md">
          <button
            role="tab"
            className={`tab ${
              selectedTab === "week" ? "tab-active !bg-primary" : ""
            }`}
            onClick={() => setSelectedTab("week")}
          >
            This Week
          </button>
          <button
            role="tab"
            className={`tab ${
              selectedTab === "month" ? "tab-active !bg-primary" : ""
            }`}
            onClick={() => setSelectedTab("month")}
          >
            This Month
          </button>
          <button
            role="tab"
            className={`tab ${
              selectedTab === "all" ? "tab-active !bg-primary" : ""
            }`}
            onClick={() => setSelectedTab("all")}
          >
            All Time
          </button>
        </div>
      </div>

      {!loading && (
        <div className="max-w-md mx-auto mt-4 pb-24">
          {selectedWorkouts.length > 0 ? (
            selectedWorkouts.map((workout) => (
              <WorkoutHistoryCard key={workout.id} workout={workout} />
            ))
          ) : (
            <div>
              {!loading && (
                <p className="text-center text-gray-500 mt-4">
                  {selectedTab === "week" && "No workouts this week."}
                  {selectedTab === "month" && "No workouts this month."}
                  {selectedTab === "all" && "No workouts yet."}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistoryTab;
