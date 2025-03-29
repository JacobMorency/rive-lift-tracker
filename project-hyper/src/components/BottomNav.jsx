import { House, Dumbbell, User } from "lucide-react";
import { Link } from "react-router-dom";

const BottomNav = () => {
  return (
    <div className="bg-black flex justify-around items-center py-2 fixed bottom-0 right-0 left-0 h-[56px]">
      <div className="">
        <Link to="/dashboard" className="text-white flex flex-col items-center">
          <House color="white" size={24} />
          <p>Home</p>
        </Link>
      </div>
      <div className="">
        <Link to="/workouts" className="text-white flex flex-col items-center">
          <Dumbbell color="white" size={24} />
          <p>Workouts</p>
        </Link>
      </div>
      <div className="">
        <Link to="/profile" className="text-white flex flex-col items-center">
          <User color="white" size={24} />
          <p>Profile</p>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
