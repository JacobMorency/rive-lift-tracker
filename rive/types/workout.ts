import type { User } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  userData: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  loading: boolean;
};
