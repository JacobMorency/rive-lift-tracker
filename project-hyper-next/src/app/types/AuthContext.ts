export interface AuthContextType {
  user: any;
  userData: { first_name: string; last_name: string; email: string } | null;
  loading: boolean;
}
