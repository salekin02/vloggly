"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
import { registerStep1Schema, RegisterStep1Values } from "@/lib/validators";
import Email from "@/components/share/authentication/form-items/email";
import LoginOptions from "@/components/share/authentication/login-options";
import { cookieOptions, useAuthStore } from "@/data";
import { initialRegister } from "@/services/api/auth";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { SignUpDataType } from "@/types";
import { setCookie } from "cookies-next";

const SignUp = () => {
  const router = useRouter();
  const params = useSearchParams();
  const redirectUrl = decodeURIComponent(params.get("redirectUrl") || "");

  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with step-specific validation schema
  const form = useForm<RegisterStep1Values>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      name: "",
      email: "",
      mobile: true,
    },
  });

  const onSubmit = async (values: RegisterStep1Values) => {
    setIsLoading(true);
    try {
      // Step 1: Initial registration with name and email
      const { name, email } = values;

      const response = (await initialRegister({
        name,
        email,
      })) as SignUpDataType;

      if (response.success && response.data) {
        // Store signup data in auth store for next steps
        useAuthStore.setState({ currentSignupData: response, user: response.data?.user });

        const { accessToken, refreshToken } = response.data;

        setCookie("accessToken", accessToken, cookieOptions);
        setCookie("refreshToken", refreshToken, cookieOptions);

        if (redirectUrl) {
          router.replace(redirectUrl);
        } else {
          // Navigate to the next step
          router.push("/sign-up/verify-email");
        }
      } else {
        // Display the exact error message from the API response
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[20px] bg-white p-5">
      <div className="mb-4">
        <p className="text-sm text-neutral-800">Step 1 of 4</p>
        <h2 className="text-[18px] font-medium text-[#383838]">
          Create your account
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-4.5 font-normal text-neutral-800">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    className="text-neutral-1000 h-10 rounded-sm border-neutral-300 bg-neutral-300 px-2.5 focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-danger-600 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <Email
                label="Email"
                labelClassName="text-neutral-800"
                {...field}
              />
            )}
          />
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
                  <div className="text-xs text-neutral-600">
                    By signing up, you agree to the{" "}
                    <Link
                      href="#"
                      className="text-brand-600 font-medium hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="text-brand-600 font-medium hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    , Including Cookie Use
                  </div>
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-brand h-11 w-full rounded-full text-white hover:bg-[#0069d1] font-medium mt-2 transition-colors"
            disabled={isLoading}
            loading={isLoading}
          >
            Sign Up
          </Button>
        </form>
      </Form>

      <LoginOptions
        legendText="Already have an account?"
        extra={
          <Link href="/sign-in" className="text-brand-600 font-medium">
            Sign In
          </Link>
        }
      />
    </div>
  );
};

export default SignUp;
