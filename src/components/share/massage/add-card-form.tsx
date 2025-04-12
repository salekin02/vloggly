"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Country, State, ICountry, IState } from "country-state-city";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { z } from "zod";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCards } from "@/hook";

// Modified schema without card fields that Stripe will handle
const billingSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  address: z.string().min(1, { message: "Address is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

type BillingFormValues = z.infer<typeof billingSchema>;

interface MessageProps {
  setCardAddDialog?: (value: boolean) => void;
  setCardAdded?: (value: boolean) => void;
  onPaymentSuccess?: (paymentMethod: unknown) => void;
  onPaymentError?: (error: unknown) => void;
}
const CARD_BRAND_ICONS = {
  visa: "/assets/images/visa.svg",
  mastercard: "/assets/images/mastercard.svg",
  paypal: "/assets/images/paypal.svg",
  default:
    "https://img.icons8.com/ios-filled/50/000000/bank-card-back-side.png",
};

const commonLabelClass = "block text-sm text-neutral-800 mb-1";
const commonInputClass =
  "rounded-sm border border-neutral-300 bg-neutral-100 px-2.5 py-2.5 h-10 focus-visible:ring-0 font-[Inter] text-sm text-neutral-1000 placeholder:text-[#BABABA] shadow-none";

const stripeInputStyles = {
  style: {
    base: {
      fontWeight: "400",
      fontSize: "14px",
      color: "#151515",
      fontSmoothing: "antialiased",
    },
  },
};
const AddCardForm = ({
  setCardAddDialog,
  onPaymentSuccess,
  onPaymentError,
}: MessageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentElementReady, setPaymentElementReady] = useState(false);
  const [cardBrand, setCardBrand] = useState("default");
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const router = useRouter();
  // Get Stripe hooks from the provider
  const stripe = useStripe();
  const elements = useElements();
  const { addCard, addCardLoading } = useCards();


  const form = useForm<BillingFormValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
    },
  });

  const onSubmit = async (values: BillingFormValues) => {
    setIsLoading(true);

    try {
      if (!stripe || !elements) {
        setIsLoading(false);
        return;
      }

      // Get all card elements
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      // Ensure all required elements exist
      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        toast.error("Card elements not found");
        setIsLoading(false);
        return;
      }

      // Submit the form to validate all inputs
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(
          submitError.message || "An error occurred with your payment method"
        );
        setIsLoading(false);
        return;
      }

      // Create payment method with Stripe
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardNumberElement)!,
          billing_details: {
            name: values.name,
            email: values.email,
            address: {
              line1: values.address,
              country: values.country,
              state: values.state,
              city: values.city,
              postal_code: values.postalCode,
            },
          },
        });

      if (stripeError) {
        toast.error(
          stripeError.message || "An error occurred with your payment method"
        );
        setIsLoading(false);
        return;
      }

      const response = addCard(paymentMethod.id, {
        onSuccess: () => {
          if (onPaymentSuccess) onPaymentSuccess(response);
          cardNumberElement.clear();
          cardExpiryElement.clear();
          cardCvcElement.clear();
        },
        onError: (error) => {
          toast.error(error.message || "Registration failed");
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      if (onPaymentError) {
        onPaymentError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!setCardAddDialog) {
      router.push("/card");
    } else {
      setCardAddDialog(false);
    }
  };

  const handleCardNumberChange = (event: {
    brand?: string;
    complete?: boolean;
    error?: { message: string };
  }) => {
    if (event.brand) {
      setCardBrand(event.brand);
    }
    if (event.complete) {
      setPaymentElementReady(true);
    }
  };

  // Load countries on component mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
      form.setValue("country", selectedCountry.isoCode);
    } else {
      setStates([]);
    }
  }, [selectedCountry, form]);

  return (
    <div className="flex-auto">
      <Card className="rounded-[20px] border border-[#0000000a] overflow-hidden py-3.5 shadow-none">
        <CardContent className="p-0">
          <h1 className="text-sm font-semibold text-[#141B34] px-4 py-2 border-b border-[#0000000a] mb-4">
            Add Card
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 px-4">
                <FormItem>
                  <FormLabel className={cn(commonLabelClass)}>
                    Card number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CardNumberElement
                        id="cardNumber"
                        onChange={handleCardNumberChange}
                        className={cn(commonInputClass)}
                        options={{
                          placeholder: "1234 5678 9012",
                          ...stripeInputStyles,
                        }}
                      />
                      <Image
                        src={
                          CARD_BRAND_ICONS[
                          cardBrand as keyof typeof CARD_BRAND_ICONS
                          ] || CARD_BRAND_ICONS.default
                        }
                        alt="Card brand"
                        width={27}
                        height={12}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>

                <FormItem>
                  <FormLabel className={cn(commonLabelClass)}>
                    Name on card
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      className={cn(commonInputClass)}
                      onChange={(e) => {
                        if (e.target.value) {
                          setPaymentElementReady(true);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel className={cn(commonLabelClass)}>
                      Expiry date
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CardExpiryElement
                          id="cardExpiry"
                          onChange={handleCardNumberChange}
                          className={cn(commonInputClass)}
                          options={{
                            placeholder: "MM/YY",
                            ...stripeInputStyles,
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>

                  <FormItem>
                    <FormLabel className={cn(commonLabelClass)}>CVC</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CardCvcElement
                          id="cardCvc"
                          className={cn(commonInputClass)}
                          onChange={handleCardNumberChange}
                          options={{
                            placeholder: "CVC",
                            ...stripeInputStyles,
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                </div>

                {/* {error && <div className="text-xs text-red-500 mt-1">{error}</div>} */}

                <div className="py-2">
                  <h2 className="text-[#141B34] text-sm font-medium">
                    Your Detail
                  </h2>
                  <p className="text-sm text-neutral-800">
                    Billing information
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(commonLabelClass)}>
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John doe"
                            className={cn(commonInputClass)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(commonLabelClass)}>
                          Billing email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="example@gmail.com"
                            className={cn(commonInputClass)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(commonLabelClass)}>
                          Country
                        </FormLabel>
                        <FormControl>
                          <Combobox
                            options={countries.map((country) => ({
                              value: country.name,
                              label: country.name,
                              isoCode: country.isoCode,
                            }))}
                            value={field.value}
                            onValueChange={(value, option) => {
                              console.log(option);
                              const country = countries.find(
                                (c) => c.name === value || c.isoCode === value
                              );
                              setSelectedCountry(country || null);
                              field.onChange(option?.isoCode || value);
                            }}
                            placeholder="Select Country"
                            searchPlaceholder="Search countries..."
                            className={cn(
                              commonInputClass,
                              "w-full font-normal"
                            )}
                            maxHeight={250}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(commonLabelClass)}>
                          State
                        </FormLabel>
                        <FormControl>
                          <Combobox
                            options={states.map((state) => ({
                              value: state.name,
                              label: state.name,
                            }))}
                            value={field.value || ""}
                            onValueChange={field.onChange}
                            placeholder="Select State"
                            searchPlaceholder="Search states..."
                            disabled={!selectedCountry}
                            className={cn(
                              commonInputClass,
                              "w-full font-normal"
                            )}
                            maxHeight={250}
                            emptyMessage={
                              selectedCountry
                                ? "No states found."
                                : "Select a country first."
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(commonLabelClass)}>
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="St. Minang lau keuy"
                          className={cn(commonInputClass)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 mt-1" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(commonLabelClass)}>
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="city"
                            placeholder="Enter city"
                            className={cn(commonInputClass)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(commonLabelClass)}>
                          Postal code
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="postalCode"
                            placeholder="ZIP"
                            className={cn(commonInputClass)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2.5 py-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 px-4.5 py-2.5 rounded-full bg-[#E6F1FD] border-transparent text-brand-500 hover:text-brand-500 hover:bg-[#E6F1FD] hover:border-brand-500 active:shadow-[0px_0px_0px_4px_rgba(0,115,230,0.20)] order-2 sm:order-1"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand h-10 rounded-full text-white hover:bg-[#0069d1] order-1 sm:order-2"
                    disabled={
                      isLoading || !stripe || !elements || !paymentElementReady
                    }
                    loading={(isLoading || addCardLoading)}
                  >
                    {(isLoading || addCardLoading) ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCardForm;
