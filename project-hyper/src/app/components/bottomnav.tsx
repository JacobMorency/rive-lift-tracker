"use client";

import { House, Dumbbell, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-base-100 border-t border-base-300 safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        <button
          className={`flex flex-col items-center justify-center w-full py-2 px-1 transition-all duration-200 ${
            pathname === "/workouts"
              ? "text-primary"
              : "text-base-content/60 hover:text-base-content"
          }`}
          onClick={() => router.push("/workouts")}
        >
          <House
            className={`size-5 mb-1 transition-all duration-200 ${
              pathname === "/workouts" ? "scale-110" : ""
            }`}
          />
          <span className="text-xs font-medium">Workouts</span>
        </button>

        <button
          className={`flex flex-col items-center justify-center w-full py-2 px-1 transition-all duration-200 ${
            pathname === "/sessions"
              ? "text-primary"
              : "text-base-content/60 hover:text-base-content"
          }`}
          onClick={() => router.push("/sessions")}
        >
          <Dumbbell
            className={`size-5 mb-1 transition-all duration-200 ${
              pathname === "/sessions" ? "scale-110" : ""
            }`}
          />
          <span className="text-xs font-medium">Sessions</span>
        </button>

        <button
          className={`flex flex-col items-center justify-center w-full py-2 px-1 transition-all duration-200 ${
            pathname === "/profile"
              ? "text-primary"
              : "text-base-content/60 hover:text-base-content"
          }`}
          onClick={() => router.push("/profile")}
        >
          <User
            className={`size-5 mb-1 transition-all duration-200 ${
              pathname === "/profile" ? "scale-110" : ""
            }`}
          />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
