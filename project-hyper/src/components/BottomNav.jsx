import { House, Dumbbell, User } from "lucide-react";
import { Link } from "react-router-dom";

const BottomNav = () => {
  return (
    <div className="bg-black flex justify-evenly items-center py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] fixed bottom-0 right-0 left-0 h-[62px]">
      <div className="">
        <Link to="/dashboard" className="text-white flex flex-col items-center">
          <House color="white" size={24} />
          <p className="text-xs m-1">Home</p>
        </Link>
      </div>
      <div className="">
        <Link to="/workouts" className="text-white flex flex-col items-center">
          <Dumbbell color="white" size={24} />
          <p className="text-xs mt-1">Workouts</p>
        </Link>
      </div>
      <div className="">
        <Link to="/profile" className="text-white flex flex-col items-center">
          <User color="white" size={24} />
          <p className="text-xs mt-1">Profile</p>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
