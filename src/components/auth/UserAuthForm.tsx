import RootLayout from "~/layouts/rootLayout";
import { Input, Button, Icons } from "@components/ui";
import { cn } from "@utils/cn";
import { api } from "@utils/api";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useState } from "react";

export interface UserAuthFormProps
  extends React.HTMLAttributes<HTMLDivElement> {
  role: "signin" | "signup";
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isGithubLoading, setisGithubLoading] = useState(false);

  const {
    mutateAsync: signupUsingCredentials,
    isLoading: isCredentialSignUpLoading,
  } = api.auth.signup.useMutation();

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
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.email) {
        errors.email = "Email is required";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }
      if (props.role === "signup" && !values.name) {
        errors.name = "Username is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        if (props.role === "signup") {
          await signupUsingCredentials(values);
        }
        await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: "/forms",
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const hanleGithubSignIn = () => {
    setisGithubLoading(true);
    void signIn("github", { callbackUrl: "/forms" });
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
                value={formik.values.email}
                onChange={formik.handleChange}
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
                  value={formik.values.name}
                  onChange={formik.handleChange}
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
                value={formik.values.password}
                onChange={formik.handleChange}
              />
            </div>
            <Button disabled={isCredentialSignUpLoading}>
              {isCredentialSignUpLoading ||
                (formik.isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ))}
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
            disabled={isCredentialSignUpLoading || isGithubLoading}
            onClick={hanleGithubSignIn}
          >
            {isGithubLoading ? (
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
