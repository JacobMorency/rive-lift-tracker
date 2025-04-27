import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import WorkoutHistoryCard from "./WorkoutHistoryCard";

const WorkoutHistoryTab = () => {
  return (
    <div>
      <Tabs defaultValue="week" className="mt-3">
        <TabsList>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
        <TabsContent value="week">
          <WorkoutHistoryCard />
        </TabsContent>
        <TabsContent value="month">Workouts This Month</TabsContent>
        <TabsContent value="all">Workouts All Time</TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutHistoryTab;
