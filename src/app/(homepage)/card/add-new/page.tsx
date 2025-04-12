"use client";

import AddCardForm from "@/components/share/massage/add-card-form";
import { StripeProvider } from "@/providers/stripe-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AddCard = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();


  const handlePaymentSuccess = () => {
    router.push("/card");
    setPaymentSuccess(true);
  };

  const handlePaymentError = (error: unknown) => {
    console.error("Payment error:", error);
    const errorMessage =
      (error as { message?: string })?.message || "Unknown error";
    toast.error("Payment failed: " + errorMessage);
  };
  return (
    <div className="w-full lg:w-[598px]">
      <StripeProvider>
        {paymentSuccess ? (
          <div className="text-center py-6">
            <div className="text-green-500 text-xl mb-2">✓</div>
            <h3 className="text-lg font-medium">Card Added.</h3>
            <p className="text-gray-500 mt-2">
              Your payment method has been added successfully.
            </p>
          </div>
        )
          :
          <AddCardForm
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        }
      </StripeProvider>
    </div>

  );
};

export default AddCard;
