import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useSignup, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const login = useLogin();
  const signup = useSignup();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    if (mode === "login") {
      login.mutate(
        { data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
            toast({ title: "Welcome back!" });
            setLocation("/");
          },
          onError: () => {
            toast({ title: "Invalid username or password", variant: "destructive" });
          },
        }
      );
    } else {
      signup.mutate(
        { data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
            toast({ title: "Account created! Welcome to PurrHeaven." });
            setLocation("/");
          },
          onError: (err: { status?: number }) => {
            if (err?.status === 409) {
              toast({ title: "Username already taken", variant: "destructive" });
            } else {
              toast({ title: "Something went wrong", variant: "destructive" });
            }
          },
        }
      );
    }
  };

  const isPending = login.isPending || signup.isPending;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            {mode === "login" ? "Welcome back" : "Join PurrHeaven"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "login"
              ? "Log in to post cats and join the community"
              : "Create an account to start fostering"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex rounded-xl bg-muted p-1 mb-8">
          <button
            data-testid="tab-login"
            onClick={() => { setMode("login"); form.reset(); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "login"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            data-testid="tab-signup"
            onClick={() => { setMode("signup"); form.reset(); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "signup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8 bg-card rounded-2xl border border-border/60 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-username"
                        placeholder="Enter your username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-password"
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                data-testid="button-submit-auth"
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending
                  ? "Please wait..."
                  : mode === "login"
                  ? "Login"
                  : "Create Account"}
              </Button>
            </form>
          </Form>

          {mode === "login" && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Test account: <span className="font-medium">testuser</span> / <span className="font-medium">cat123</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
