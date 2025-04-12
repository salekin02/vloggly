"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

// Load the Stripe.js library with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  // Configure Elements with setup mode for collecting payment methods
  // Added configuration for 3D Secure support
  const options = {
    mode: "setup" as const,
    currency: "eur" as const,
    // These options help with 3D Secure handling
    paymentMethodCreation: "manual" as const,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#0073e6",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
