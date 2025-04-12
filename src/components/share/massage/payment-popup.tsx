"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "hugeicons-react";
import MyCard from "@/components/share/card/my-card";
import { useState } from "react";
import Image from "next/image";
import AddCardForm from "./add-card-form";
import { StripeProvider } from "@/providers/stripe-provider";
import { useCards } from "@/hook";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { makePayment } from "@/services/api/payment";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useSocket } from "@/hook/useSocket";

interface DialogPrpops {
  openDialog: boolean;
  setOpendialog: (value: boolean) => void;
  price?: number;
  creatorId?: string;
  messageId?: string;
  roomId?: string;
}

export const PaymentPopup = ({
  openDialog,
  setOpendialog,
  price,
  creatorId = "",
  messageId,
  roomId,
}: DialogPrpops) => {
  return (
    <StripeProvider>
      <PaymentPopupContent
        openDialog={openDialog}
        setOpendialog={setOpendialog}
        price={price}
        creatorId={creatorId}
        messageId={messageId}
        roomId={roomId}
      />
    </StripeProvider>
  );
};

const PaymentPopupContent = ({
  openDialog,
  setOpendialog,
  price,
  creatorId,
  messageId,
  roomId,
}: DialogPrpops) => {
  const { cards, cardsLoading } = useCards();
  const [cardAddDialog, setCardAddDialog] = useState<boolean>(false);
  const [addCardSuccess, setAddCardSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing3DS, setProcessing3DS] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const { sendPayment, isConnected } = useSocket(roomId);

  const handlePaymentSuccess = () => {
    setAddCardSuccess(true);
    setTimeout(() => {
      setCardAddDialog(false);
    }, 1000);
  };

  const handlePaymentError = (error: unknown) => {
    console.error("Payment error:", error);
    const errorMessage =
      (error as { message?: string })?.message || "Unknown error";
    toast.error("Payment failed: " + errorMessage);
  };

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe has not been initialized");
      return;
    }

    if (!messageId) {
      toast.error("Message ID is missing");
      return;
    }

    if (!price) {
      toast.error("Price is missing");
      return;
    }

    if (!roomId) {
      toast.error("Room ID is missing, cannot process payment");
      return;
    }

    if (!isConnected) {
      toast.error("Socket is not connected, please try again.");
      return;
    }

    setLoading(true);
    try {
      const response = await makePayment({
        amount: price,
        paymentType: "paidContent",
        currency: "eur",
        creatorId: creatorId as string,
      });

      setLoading(false);

      if (response.success) {
        setPaymentSuccess(true);
        sendPayment(messageId, price); // Sets isPaymentDone: true
        setTimeout(() => {
          setOpendialog(false);
          setPaymentSuccess(false);
        }, 3000);
      } else if (response.data?.clientSecret) {
        setProcessing3DS(true);
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          response.data.clientSecret
        );
        setProcessing3DS(false);

        if (error) {
          toast.error(error.message || "Payment authentication failed");
          return;
        }

        if (paymentIntent.status === "succeeded") {
          setPaymentSuccess(true);
          sendPayment(messageId, price);
          setTimeout(() => {
            setOpendialog(false);
            setPaymentSuccess(false);
          }, 3000);
        } else {
          toast.error("Payment failed to complete");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      setProcessing3DS(false);
      handlePaymentError(error);
    }
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpendialog}>
        <DialogContent className="w-[412px] p-0">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex flex-col justify-center">
            {paymentSuccess ? (
              <div className="text-center py-2">
                <div className="text-green-500 text-xl mb-2">✓</div>
                <h3 className="text-lg font-medium">Purchase Successful.</h3>
                <p className="text-gray-500 mt-2">
                  Your payment has been done successfully.
                </p>
              </div>
            ) : processing3DS ? (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-2"></div>
                <h3 className="text-lg font-medium">Verifying Payment</h3>
                <p className="text-gray-500 mt-2">
                  Please complete the authentication process if prompted by your
                  bank.
                </p>
              </div>
            ) : (
              <>
                <div className="grid text-center mt-5">
                  <span className="font-medium text-base mb-2">
                    Confirm Message Purchase
                  </span>
                  <span className="text-sm font-light text-neutral-600">
                    {`To view this content, you will be charged`}{" "}
                    <span className="text-sm font-bold text-brand-600">
                      €{price}
                    </span>
                  </span>
                </div>

                {(() => {
                  const defaultCard =
                    cards.find((item) => item.isDefault) || cards?.[0];
                  return (
                    <>
                      {cardsLoading ? (
                        <Skeleton />
                      ) : defaultCard ? (
                        <div className="mx-4 my-6">
                          <MyCard
                            {...defaultCard}
                            id={defaultCard.id!}
                            isPaymentCard
                          />
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-between mx-4 my-6 border rounded-[16] p-1 cursor-pointer"
                          onClick={() => setCardAddDialog(true)}
                        >
                          <Button className="bg-white shadow-none text-sm text-brand-600 font-medium hover:bg-white rounded-[16]">
                            <PlusSignIcon size={13} />
                            Add Card
                          </Button>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/assets/images/visa.svg"
                              alt="Visa"
                              width={38}
                              height={12}
                            />
                            <Image
                              src="/assets/images/mastercard.svg"
                              alt="Mastercard"
                              width={27}
                              height={16}
                            />
                            <Image
                              src="/assets/images/paypal.svg"
                              alt="PayPal"
                              width={14}
                              height={16}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}

                <div className="py-4 flex gap-2 justify-center border-t border-border px-4">
                  <Button
                    className="py-2.5 text-sm font-medium w-[50%] bg-brand-50 text-brand-600 rounded-[24]"
                    variant={"secondary"}
                    onClick={() => setOpendialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="py-2.5 text-sm font-medium w-[50%] rounded-[24]"
                    disabled={
                      !cards?.length || loading || processing3DS || !isConnected
                    }
                    onClick={handlePayment}
                    loading={loading}
                  >
                    Pay
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={cardAddDialog} onOpenChange={setCardAddDialog}>
        <DialogContent className="p-0 max-h-[750px] overflow-auto">
          <DialogTitle className="hidden"></DialogTitle>
          {addCardSuccess ? (
            <div className="text-center py-2">
              <div className="text-green-500 text-xl mb-2">✓</div>
              <h3 className="text-lg font-medium">Card Added.</h3>
              <p className="text-gray-500 mt-2">
                Your payment method has been added successfully.
              </p>
            </div>
          ) : (
            <AddCardForm
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              setCardAddDialog={setCardAddDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
