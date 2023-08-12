import { useState } from "react";
import RootLayout from "../rootLayout";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";

export interface UserAuthFormProps
  extends React.HTMLAttributes<HTMLDivElement> {
  role: "signin" | "signup";
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <RootLayout title="Authentication">
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-4">
              <Input
                id="email"
                label="Email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
              />
              {props.role === "signup" && (
                <Input
                  id="name"
                  label="Username"
                  placeholder="jhon doe"
                  type="text"
                  autoComplete="username"
                  autoCorrect="on"
                  disabled={isLoading}
                />
              )}
              <Input
                id="password"
                label="Password"
                placeholder="********"
                type="password"
                pattern=".{8,}"
                autoComplete="password"
                disabled={isLoading}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {props.role === "signin" ? "Sign in" : "Sign up"} with Email
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2">
          <Button variant="outline" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.gitHub className="mr-2 h-4 w-4" />
            )}{" "}
            Github
          </Button>
          <Button variant="outline" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}{" "}
            Google
          </Button>
        </div>
      </div>
    </RootLayout>
  );
}
