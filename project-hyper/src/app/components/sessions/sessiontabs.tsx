"use client";

import { useState, useEffect } from "react";
import { Play, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Session = {
  id: string;
  name: string;
  started_at: string;
  ended_at: string | null;
  completed: boolean;
};

type SessionTabsProps = {
  sessions: Session[];
};

const SessionTabs = ({ sessions }: SessionTabsProps) => {
  const [selectedSessions, setSelectedSessions] = useState<Session[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("week");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (sessions.length === 0) {
      return;
    }

    setLoading(true);

    const fetchWeeklySessions = (): void => {
      const today = new Date();
      const currentYear = today.getFullYear();

      // Set start of the week to Sunday at 00:00
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      // Set end of the week to Saturday at 23:59
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);

      const weeklySessions = sessions.filter((session) => {
        const sessionDate = new Date(session.started_at);
        sessionDate.setHours(0, 0, 0, 0);
        return (
          sessionDate >= startOfWeek &&
          sessionDate <= endOfWeek &&
          sessionDate.getFullYear() === currentYear
        );
      });

      setSelectedSessions(weeklySessions);
      setLoading(false);
    };

    const fetchMonthlySessions = (): void => {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const monthlySessions = sessions.filter((session) => {
        const sessionDate = new Date(session.started_at);
        return (
          sessionDate.getMonth() === currentMonth &&
          sessionDate.getFullYear() === currentYear
        );
      });

      setSelectedSessions(monthlySessions);
      setLoading(false);
    };

    const fetchAllSessions = (): void => {
      setSelectedSessions(sessions);
      setLoading(false);
    };

    if (selectedTab === "week") fetchWeeklySessions();
    else if (selectedTab === "month") fetchMonthlySessions();
    else if (selectedTab === "all") fetchAllSessions();
  }, [sessions, selectedTab]);

  const handleSessionClick = (sessionId: string) => {
    router.push(`/sessions/${sessionId}`);
  };

  return (
    <div className="mt-3">
      <div className="flex justify-center">
        <div role="tablist" className="tabs tabs-box bg-base-100 shadow-md">
          <button
            role="tab"
            className={`tab ${
              selectedTab === "week" ? "tab-active !bg-primary" : ""
            }`}
            onClick={() => setSelectedTab("week")}
          >
            This Week
          </button>
          <button
            role="tab"
            className={`tab ${
              selectedTab === "month" ? "tab-active !bg-primary" : ""
            }`}
            onClick={() => setSelectedTab("month")}
          >
            This Month
          </button>
          <button
            role="tab"
            className={`tab ${
              selectedTab === "all" ? "tab-active !bg-primary" : ""
            }`}
            onClick={() => setSelectedTab("all")}
          >
            All Time
          </button>
        </div>
      </div>

      {!loading && (
        <div className="px-4 mt-4">
          {selectedSessions.length > 0 ? (
            <div className="space-y-1">
              {selectedSessions.map((session) => (
                <button
                  key={session.id}
                  className="btn btn-ghost w-full py-6 text-left bg-base-100"
                  onClick={() => handleSessionClick(session.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <Play className="size-5 text-primary mr-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-base-content">
                        {session.name}
                      </div>
                      <div className="text-xs text-base-content/60">
                        {new Date(session.started_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge badge-sm ${
                          session.completed ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {session.completed ? "Completed" : "In Progress"}
                      </span>
                      <ChevronRight className="size-5 text-base-content/40 flex-shrink-0 ml-2" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Play className="size-12 text-base-content/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-base-content mb-2">
                No Sessions
              </h3>
              <p className="text-base-content/60">
                {selectedTab === "week" && "No sessions this week."}
                {selectedTab === "month" && "No sessions this month."}
                {selectedTab === "all" && "No sessions yet."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionTabs;
