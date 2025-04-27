import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

import WorkoutHistoryCard from "./WorkoutHistoryCard";

const WorkoutHistoryTab = ({ workouts }) => {
  const [isWeekActive, setIsWeekActive] = useState(true);
  const [isMonthActive, setIsMonthActive] = useState(false);
  const [isAllActive, setIsAllActive] = useState(false);
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

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday

    const weeklyWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
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
        <TabsList>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
        <TabsContent value="week">
          <TabsContent value="week">
            {selectedWorkouts.map((workout) => (
              <WorkoutHistoryCard key={workout.id} workout={workout} />
            ))}
          </TabsContent>
        </TabsContent>
        <TabsContent value="month">
          {selectedWorkouts.map((workout) => (
            <WorkoutHistoryCard key={workout.id} workout={workout} />
          ))}
        </TabsContent>
        <TabsContent value="all">
          {selectedWorkouts.map((workout) => (
            <WorkoutHistoryCard key={workout.id} workout={workout} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutHistoryTab;
