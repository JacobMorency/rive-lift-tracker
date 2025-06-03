type DashboardCardProps = {
  title: string;
  content: string;
  description: string;
  icon?: React.ReactNode;
};

const DashboardCard = ({
  title,
  content,
  description,
  icon,
}: DashboardCardProps) => {
  return (
    <div className="p-4">
      <div className="card card-border bg-primary">
        <div className="card-body">
          <div className="flex items-center justify-between w-full">
            <span className="card-title">{title}</span>
            {icon && (
              <div className="text-muted-foreground w-5 h-5 flex items-center justify-center">
                {icon}
              </div>
            )}
          </div>
          <div className="text-3xl font-medium">{content}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
