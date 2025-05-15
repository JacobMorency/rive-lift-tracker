import { House, Dumbbell, User } from "lucide-react";
import useCurrentPath from "@/app/hooks/useCurrentPath";
import { useState, useEffect } from "react";

const BottomNav = () => {
  const pathname = useCurrentPath();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const getCurrentPage = () => {
      setCurrentPage(pathname);
    };
    getCurrentPage();
  }, []);

  return (
    <div className="dock">
      <button className={currentPage == "/dashboard" ? "dock-active" : ""}>
        <House className="size-[1.2em]" />
        <span className="dock-label">Home</span>
      </button>
      <button className={currentPage == "/workouts" ? "dock-active" : ""}>
        <Dumbbell className="size-[1.2em]" />
        <span className="dock-label">Workouts</span>
      </button>
      <button className={currentPage == "/profile" ? "dock-active" : ""}>
        <User className="size-[1.2em]" />
        <span className="dock-label">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;
