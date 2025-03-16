import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginForm = () => {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Welcome! Please login to your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action="">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="Email" />
            </div>
            <div className="space-y-1.5 mt-3">
              <Label>Password</Label>
              <Input type="password" placeholder="Password" />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
