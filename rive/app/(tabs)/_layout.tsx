import { Slot, Redirect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading || user === undefined) return null;
  if (!user) return <Redirect href="/login" />;

  return <Slot />;
}
