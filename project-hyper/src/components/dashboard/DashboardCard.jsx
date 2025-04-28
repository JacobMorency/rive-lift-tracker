import { Card } from "@/components/ui/card";

const DashboardCard = ({ title, content, description, icon }) => {
  return (
    <div>
      <Card className="px-6">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium text-md">{title}</span>
          {icon && (
            <div className="text-muted-foreground w-5 h-5 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        <div className="text-3xl font-medium">{content}</div>
        <div className="text-gray-500 text-sm">{description}</div>
      </Card>
    </div>
  );
};

export default DashboardCard;
