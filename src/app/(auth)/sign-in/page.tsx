"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { ViewIcon, ViewOffIcon } from "hugeicons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import Template from "@/components/share/authentication/template";
import Email from "@/components/share/authentication/form-items/email";
import ForgotPassword from "@/components/share/authentication/forgot-password";
import LoginOptions from "@/components/share/authentication/login-options";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { cookieOptions, useAuthStore } from "@/data";
import { emailLogin } from "@/services";
import { setCookie } from "cookies-next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Onboarding = () => {
  return (
    <Suspense fallback={<Skeleton className="h-2" />}>
      <SignIn />
    </Suspense>
  );
};

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      mobile: true,
    },
  });
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await emailLogin({
        email: values.email,
        password: values.password,
      });

      if (response.success) {
        if (response.data?.isEmailVerified === false) {
          toast.error("Please verify your email address");
          router.push("/sign-up/verify-email");
          return;
        }
        if (response.data) {
          const { accessToken, refreshToken } = response.data;
          useAuthStore.setState({
            isAuthenticated: true,
            user: response.data?.user,
            currentSignupData: response,
          });
          // Store signup data in auth store for next steps
          setCookie("accessToken", accessToken, cookieOptions);
          setCookie("refreshToken", refreshToken, cookieOptions);
          setCookie("isAuthenticated", "true");
        }
        // toast.success(response.message || "Login successful");
        router.push(redirect || "/home");
      } else {
        toast.error(response.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Template>
      <div className="relative -top-22 sm:top-0 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md rounded-xl bg-white p-8"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Email label="Email Address" {...field} />
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm leading-4.5 font-normal text-neutral-900">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          className="text-neutral-1000 h-10 rounded-sm border-neutral-300 bg-neutral-300 px-2.5 focus-visible:ring-0"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 p-0 text-gray-500 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <ViewOffIcon className="h-5 w-5" />
                          ) : (
                            <ViewIcon className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-danger-600" />
                  </FormItem>
                )}
              />

              <ForgotPassword />

              <div className="mb-8">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start">
                      <FormControl>
                        <Checkbox
                          className="relative top-0.5 data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-xs text-neutral-600">
                        <div>
                          You agree to our{" "}
                          <Link href="#" className="text-brand-600 font-medium">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="#" className="text-brand-600 font-medium">
                            Privacy Policy
                          </Link>
                          , and confirm that you are at least 18 years old
                        </div>
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="bg-brand h-10 w-full rounded-full text-white hover:bg-[#0069d1]"
                disabled={isLoading}
                loading={isLoading}
              >
                Sign In
              </Button>
            </div>

            <LoginOptions />
          </form>
          <div className="mt-10 text-center text-sm text-neutral-600">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-brand-600 font-medium">
              Sign Up
            </Link>
          </div>
        </Form>
      </div>
    </Template>
  );
}

export default Onboarding;
