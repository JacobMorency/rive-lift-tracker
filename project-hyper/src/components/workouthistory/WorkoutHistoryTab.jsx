import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

import WorkoutHistoryCard from "./WorkoutHistoryCard";

const WorkoutHistoryTab = ({ workouts }) => {
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

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

  return (
    <div>
      <Tabs
        defaultValue="week"
        onValueChange={(value) => handleTabChange(value)}
        className="mt-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
        <TabsContent value="week">
          {selectedWorkouts.length > 0 ? (
            <div className="pb-24">
              {selectedWorkouts.map((workout) => (
                <WorkoutHistoryCard key={workout.id} workout={workout} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No workouts this week.
            </p>
          )}
        </TabsContent>

        <TabsContent value="month">
          {selectedWorkouts.length > 0 ? (
            <div className="pb-24">
              {selectedWorkouts.map((workout) => (
                <WorkoutHistoryCard key={workout.id} workout={workout} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No workouts this month.
            </p>
          )}
        </TabsContent>

        <TabsContent value="all">
          {selectedWorkouts.length > 0 ? (
            <div className="pb-24">
              {selectedWorkouts.map((workout) => (
                <WorkoutHistoryCard key={workout.id} workout={workout} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">No workouts yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutHistoryTab;
