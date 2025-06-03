"use client";

import { House, Dumbbell, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div>
      <div className="dock bg-base-200 safe-bottom">
        <button
          className={pathname === "/dashboard" ? "dock-active" : ""}
          onClick={() => router.push("/dashboard")}
        >
          <House className="size-[1.2em]" />
          <span className="dock-label">Home</span>
        </button>
        <button
          className={
            pathname === "/workouts" || pathname.includes("addworkout")
              ? "dock-active"
              : ""
          }
          onClick={() => router.push("/workouts")}
        >
          <Dumbbell className="size-[1.2em]" />
          <span className="dock-label">Workouts</span>
        </button>
        <button
          className={pathname === "/profile" ? "dock-active" : ""}
          onClick={() => router.push("/profile")}
        >
          <User className="size-[1.2em]" />
          <span className="dock-label">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
