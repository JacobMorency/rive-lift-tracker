import { Button } from "@/components/ui/button";

const CardActionButtons = () => {
  return (
    <div className="flex gap-2">
      <Button className="">Edit</Button>
      <Button className="bg-error">Delete</Button>
    </div>
  );
};

export default CardActionButtons;
