import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ExerciseDetails = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between border-t-1 py-2">
          <span className="font-medium">Exercise Name</span>
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        <CollapsibleContent>
          <ul className="list-disc list-inside px-8 py-2">
            <li>test 1</li>
            <li>test 2</li>
            <li>test 3</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ExerciseDetails;
