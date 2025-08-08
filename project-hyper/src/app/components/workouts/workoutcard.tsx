"use client";

import { LucideIcon } from "lucide-react";

type WorkoutCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "primary" | "default";
};

const WorkoutCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  variant = "default",
}: WorkoutCardProps) => {
  const isPrimary = variant === "primary";

  return (
    <div className="px-4 mb-4">
      <div
        className={`card card-border transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl ${
          isPrimary
            ? "bg-primary hover:bg-primary/90"
            : "bg-base-300 hover:bg-base-200"
        }`}
        onClick={onClick}
      >
        <div className="card-body">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3
                className={`card-title text-lg ${
                  isPrimary ? "text-primary-content" : "text-base-content"
                }`}
              >
                {title}
              </h3>
              <p
                className={`text-sm ${
                  isPrimary ? "text-primary-content/80" : "text-base-content/60"
                }`}
              >
                {description}
              </p>
            </div>
            <div
              className={`rounded-full p-2 ${
                isPrimary ? "bg-primary-content/20" : "bg-primary/20"
              }`}
            >
              <Icon
                className={`size-6 ${
                  isPrimary ? "text-primary-content" : "text-primary"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
