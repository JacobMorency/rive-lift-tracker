import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

import ExerciseDetails from "./ExerciseDetails";
import CardActionButtons from "./CardActionButtons";

import { useState } from "react";

const WorkoutHistoryCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <Card className="px-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between py-2">
            <span className="font-medium text-xl">4/21/2025 - # exercises</span>
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
          {isOpen && (
            <div>
              <ExerciseDetails />
              <div className="flex justify-end pt-4">
                <CardActionButtons />
              </div>
            </div>
          )}
        </Collapsible>
      </Card>
    </div>
  );
};

export default WorkoutHistoryCard;
