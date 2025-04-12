"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { registerStep3Schema, RegisterStep3Values } from "@/lib/validators";

import { completeRegister } from "@/services/api/auth";
import { toast } from "sonner";
import { getCookie } from "cookies-next";

const PasswordSetup = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with validation schema
  const form = useForm<RegisterStep3Values>({
    resolver: zodResolver(registerStep3Schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterStep3Values) => {
    setIsLoading(true);
    const accessToken = await getCookie("accessToken");
    try {
      if (!accessToken) {
        toast.error("Session expired. Please start again.");
        router.push("/sign-up");
        return;
      }

      const { password, confirmPassword } = values;

      const response = await completeRegister({
        password,
        confirmPassword,
      });

      if (response.success && response.data) {
        // toast.success("Account created successfully");

        // Navigate to the next step
        router.push("/sign-up/profile");
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Password setup error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[20px] bg-white p-5">
      <div className="mb-4">
        <p className="text-sm text-neutral-800">Step 3 of 4</p>
        <h2 className="text-[18px] font-medium text-[#383838]">
          You&apos;ll need a password
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-4.5 font-normal text-neutral-800">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="******"
                      type={showPassword ? "text" : "password"}
                      className="text-neutral-1000 placeholder:text-[#151515] placeholder:text-sm h-10 rounded-sm border-neutral-300 bg-neutral-300 px-2.5 focus-visible:ring-0"
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
                <FormMessage className="text-danger-600 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-4.5 font-normal text-neutral-800">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="******"
                      type={showConfirmPassword ? "text" : "password"}
                      className="text-neutral-1000 placeholder:text-[#151515] placeholder:text-sm h-10 rounded-sm border-neutral-300 bg-neutral-300 px-2.5 focus-visible:ring-0"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 p-0 text-gray-500 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <ViewOffIcon className="h-5 w-5" />
                      ) : (
                        <ViewIcon className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-danger-600 text-xs" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-brand h-11 w-full rounded-full text-white hover:bg-[#0069d1] font-medium mt-1 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Next"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordSetup;
