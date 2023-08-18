import RootLayout from "../rootLayout";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { api } from "~/utils/api";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState } from "react";

export interface UserAuthFormProps
  extends React.HTMLAttributes<HTMLDivElement> {
  role: "signin" | "signup";
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isGithubSignInLoading, setIsGithubSignInLoading] = useState(false);

  const { mutateAsync: signup, isLoading: isCredentialSignUpLoading } =
    api.auth.signup.useMutation();

  function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    void formik.submitForm();
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async (values) => {
      try {
        if (props.role === "signup") {
          await signup(values);
        }
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: "/",
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const hanleGithubSignIn = () => {
    void signIn("github", { callbackUrl: "/" });
  };

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
                disabled={isCredentialSignUpLoading}
              />
              {props.role === "signup" && (
                <Input
                  id="name"
                  label="Username"
                  placeholder="jhon doe"
                  type="text"
                  autoComplete="username"
                  autoCorrect="on"
                  disabled={isCredentialSignUpLoading}
                />
              )}
              <Input
                id="password"
                label="Password"
                placeholder="********"
                type="password"
                pattern=".{8,}"
                autoComplete="password"
                disabled={isCredentialSignUpLoading}
              />
            </div>
            <Button disabled={isCredentialSignUpLoading}>
              {isCredentialSignUpLoading && (
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
          <Button
            variant="outline"
            disabled={isCredentialSignUpLoading || isGithubSignInLoading}
            onClick={hanleGithubSignIn}
          >
            {isCredentialSignUpLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.gitHub className="mr-2 h-4 w-4" />
            )}{" "}
            Github
          </Button>
          <Button variant="outline" disabled={isCredentialSignUpLoading}>
            <Icons.google className="mr-2 h-4 w-4" /> Google
          </Button>
        </div>
      </div>
    </RootLayout>
  );
}
