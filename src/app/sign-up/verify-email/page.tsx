"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { useAuthStore } from "@/data";
import { verifyEmail, resendCode } from "@/services/api/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { getCookie } from "cookies-next";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema } from "@/lib/validators";

const VerifyEmail = () => {
  const router = useRouter();
  const { currentSignupData } = useAuthStore();

  const { message: signUpResponseMessage = "", data } = currentSignupData || {};
  const { user } = data || {};
  const toastShown = useRef(false);

  useEffect(() => {
    if (signUpResponseMessage && !toastShown.current) {
      // toast.success(signUpResponseMessage);
      toastShown.current = true;
    }
  }, [signUpResponseMessage]);

  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      verificationCode: undefined,
    },
  });

  const onSubmit = async (values: { verificationCode: string }) => {
    setIsLoading(true);

    const { verificationCode } = values;

    try {
      const accessToken = await getCookie("accessToken");
      if (!accessToken) {
        toast.error("Session expired. Please start again.");
        router.push("/sign-up");
        return;
      }

      const response = await verifyEmail({
        verificationCode,
      });

      if (response.success && response.data) {
        //useAuthStore.setState({ currentSignupData: null });

        // toast.success("Email verified successfully");

        // Navigate to the next step
        router.push("/sign-up/set-password");
      } else {
        toast.error(response.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {

    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      toast.error("Session expired. Please start again.");
      router.push("/sign-up");
      return;
    }

    setResendLoading(true);
    try {
      const response = await resendCode({
        email: user?.email || "",
      });
      if (response.success && response.data) {
        toast.success("New code sent to your email");
      } else {
        toast.error(response.message || "Failed to resend code");
      }
    } catch (error) {
      console.error("Resend code error:", error);
      toast.error("Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[20px] bg-white p-5">
      <div className="mb-4">
        <p className="text-sm text-neutral-800">Step 1 of 4</p>
        <h2 className="text-[18px] font-medium text-[#383838]">
          Create your account
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          To confirm your account, enter the 6-digit code we sent to your email
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-900">
                  Confirmation code
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="6-digit code"
                    className="text-neutral-1000 h-10 rounded-sm border-neutral-300 bg-neutral-300 px-2.5 focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-danger-600" />
              </FormItem>
            )}
          />

          <div className="text-center flex flex-col gap-2.5">
            <Button
              type="submit"
              className="bg-brand h-10 w-full rounded-full text-white hover:bg-[#0069d1] font-medium transition-colors"
              disabled={isLoading || resendLoading}
            >
              {isLoading ? "Verifying..." : "Next"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 rounded-full bg-[#E6F1FD] border-transparent text-brand-500 hover:text-brand-500 hover:bg-[#E6F1FD] hover:border-brand-500 active:shadow-[0px_0px_0px_4px_rgba(0,115,230,0.20)]"
              onClick={handleResendCode}
              disabled={isLoading || resendLoading}
            >
              I didn&apos;t get the code
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VerifyEmail;
