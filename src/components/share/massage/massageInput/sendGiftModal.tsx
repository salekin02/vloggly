// // src/components/share/massage/sendGiftModal.tsx
// "use client";

// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import AddCardForm from "../add-card-form"; // Adjust path
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useMassageStore } from "@/data";
// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { fetchSubscriberRooms } from "@/services";
// import MyCard from "../../card/my-card";
// import { makePayment } from "@/services/api/payment";
// import { Skeleton } from "@/components/ui/skeleton";
// import { StripeProvider } from "@/providers/stripe-provider";
// import { toast } from "sonner";
// import { useCards } from "@/hook";
// import { CreatorDetails, CreatorProfile } from "@/types";
// import { useElements, useStripe } from "@stripe/react-stripe-js";

// interface SendGiftProps {
//   open: boolean;
//   setOpen: (value: boolean) => void;
//   onSuccess: (tipAmount: number) => void;
//   creator?: CreatorProfile;
// }

// export const SendGift = ({ ...rest }: SendGiftProps) => {
//   return (
//     <StripeProvider>
//       <Component {...rest} />
//     </StripeProvider>
//   );
// };
// const Component = ({ open, setOpen, onSuccess, creator }: SendGiftProps) => {
//   const [showCardForm, setShowCardForm] = useState<boolean>(false);
//   const { clickedMsg } = useMassageStore();
//   const [amount, setAmount] = useState<number>();

//   const [creatorInfo, setCreatorInfo] = useState<CreatorDetails>({
//     name: "Loading...",
//     username: "",
//     profilePicture: "",
//     creatorId: "",
//   });
//   const { cards, cardsLoading } = useCards();

//   const [addCardSuccess, setAddCardSuccess] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   const stripe = useStripe();
//   const elements = useElements();

//   const handlePaymentSuccess = () => {
//     setAddCardSuccess(true);
//     setTimeout(() => {
//       setShowCardForm(false);
//     }, 1000);
//   };

//   useEffect(() => {
//     if (creator) {
//       setCreatorInfo(creator);
//     }
//   }, [creator, creator?.userId]);

//   const handlePaymentError = (error: unknown) => {
//     console.error("Payment error:", error);
//     const errorMessage =
//       (error as { message?: string })?.message || "Unknown error";
//     toast.error("Payment failed: " + errorMessage);
//   };

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCreator = async () => {
//       if (clickedMsg) {
//         const response = await fetchSubscriberRooms();
//         if (response.success) {
//           const room = response.data.find((r) => r.roomId === clickedMsg);
//           if (room) {
//             setCreatorInfo({
//               name: room.creator?.name || "Unknown",
//               username: room.creator?.username || "unknown",
//               profilePicture: room.creator?.profilePicture || "",
//               creatorId: room.creatorId || "",
//             });
//           }
//         }
//       }
//     };
//     if (!creator?.userId) fetchCreator();
//   }, [clickedMsg, creator?.userId]);

//   const [processing3DS, setProcessing3DS] = useState(false);

//   const handlePayment = async (type: string) => {
//     if (type === "add") {
//       setShowCardForm(true);
//       return;
//     }

//     if (!amount || amount < 10) {
//       toast.error("Please enter a valid amount (minimum $10).");
//       return;
//     }

//     if (!creatorInfo.creatorId) {
//       return;
//     }

//     if (!stripe || !elements) {
//       toast.error("Stripe has not been initialized");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Make the payment request to get client secret
//       const response = await makePayment({
//         amount: amount,
//         paymentType: "tips",
//         currency: "eur",
//         creatorId: creatorInfo.creatorId,
//       });

//       if (!response.success) {
//         toast.error(response.message);
//         setLoading(false);
//         return;
//       }

//       // If the response includes a client secret, handle 3DS authentication
//       if (response.data?.clientSecret) {
//         setProcessing3DS(true);

//         // Use Stripe's confirmCardPayment to handle 3DS authentication
//         const { error, paymentIntent } = await stripe.confirmCardPayment(
//           response.data.clientSecret
//         );

//         setProcessing3DS(false);

//         if (error) {
//           // Show error to your customer
//           toast.error(
//             error.message || "An error occurred during payment authentication"
//           );
//           setLoading(false);
//           return;
//         }

//         // Payment successful
//         if (paymentIntent.status === "succeeded") {
//           setPaymentSuccess(true);
//           onSuccess(amount);
//           setTimeout(() => {
//             setOpen(false);
//             setPaymentSuccess(false);
//           }, 3000);
//           setAmount(undefined);
//         }
//       } else {
//         // Handle non-3DS payment success
//         setPaymentSuccess(true);
//         onSuccess(amount);
//         setTimeout(() => {
//           setOpen(false);
//           setPaymentSuccess(false);
//         }, 3000);
//         setAmount(undefined);
//       }
//     } catch (error) {
//       console.error("Payment processing error:", error);
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "An unexpected error occurred during payment"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent
//         className={`p-0 ${showCardForm ? "h-[700px] w-[598px]" : "w-[412px]"} overflow-auto`}
//       >
//         <DialogTitle className="hidden"></DialogTitle>
//         {paymentSuccess ? (
//           <div className="text-center py-2">
//             <div className="text-green-500 text-xl mb-2">✓</div>
//             <h3 className="text-lg font-medium">Payment Successful.</h3>
//             <p className="text-gray-500 mt-2">
//               Your payment has been sent successfully.
//             </p>
//           </div>
//         ) : processing3DS ? (
//           <div className="text-center py-2">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-2"></div>
//             <h3 className="text-lg font-medium">Verifying Payment</h3>
//             <p className="text-gray-500 mt-2">
//               Please complete the authentication process if prompted by your
//               bank.
//             </p>
//           </div>
//         ) : (
//           <div className="flex flex-col justify-center">
//             {!(showCardForm && addCardSuccess) && (
//               <div className="grid text-center mt-5">
//                 <span className="font-medium text-base mb-2">Send Tip</span>
//                 <span className="text-sm font-light text-neutral-600">
//                   Show your support by sending a tip!
//                 </span>
//               </div>
//             )}

//             {!showCardForm ? (
//               <div>
//                 <div className="py-5">
//                   <div className="grid grid-cols-7 px-4 pb-5 gap-2.5">
//                     <div>
//                       <Avatar className="">
//                         <AvatarImage
//                           width={48}
//                           height={48}
//                           className="rounded-[50px]"
//                           src={creatorInfo.profilePicture}
//                           alt={creatorInfo.name}
//                         />
//                         <AvatarFallback>
//                           {creatorInfo.name?.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                     </div>
//                     <div className="col-span-6">
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-medium text-black">
//                           {creatorInfo.name}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center gap-4">
//                         <span className="text-sm font-normal">
//                           @{creatorInfo.username}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-1 px-4">
//                     <Input
//                       type="number"
//                       placeholder="$20"
//                       min={10}
//                       value={amount}
//                       onChange={(e) => setAmount(parseInt(e.target.value))}
//                       className="rounded-[10px] select-none bg-gray-100 text-black px-4 border-none"
//                       autoFocus={false}
//                     />
//                     <p className="text-gray-400 text-sm">Minimum $10</p>
//                   </div>
//                 </div>
//                 {(() => {
//                   const defaultCard =
//                     cards.find((item) => item.isDefault) || cards?.[0];
//                   return (
//                     <>
//                       {cardsLoading ? (
//                         <Skeleton />
//                       ) : (
//                         defaultCard && (
//                           <div className="mx-4 mb-4">
//                             <MyCard
//                               {...defaultCard}
//                               id={defaultCard.id!}
//                               isPaymentCard
//                             />
//                           </div>
//                         )
//                       )}
//                       <div className="py-4 flex gap-2 justify-center border-t border-border px-4">
//                         <Button
//                           disabled={loading}
//                           className="py-2.5 text-sm font-medium w-[50%] bg-brand-50 text-brand-600 rounded-[24px]"
//                           variant="secondary"
//                           onClick={() => setOpen(false)}
//                         >
//                           Cancel
//                         </Button>
//                         <Button
//                           loading={loading}
//                           disabled={loading || !amount || amount < 10}
//                           className="py-2.5 text-sm font-medium w-[50%] rounded-[24px]"
//                           onClick={() =>
//                             handlePayment(defaultCard ? "" : "add")
//                           }
//                         >
//                           {defaultCard ? "Pay" : "Add Payment"}
//                         </Button>
//                       </div>
//                     </>
//                   );
//                 })()}
//               </div>
//             ) : (
//               <>
//                 {addCardSuccess ? (
//                   <div className="text-center py-2">
//                     <div className="text-green-500 text-xl mb-2">✓</div>
//                     <h3 className="text-lg font-medium">Card Added.</h3>
//                     <p className="text-gray-500 mt-2">
//                       Your payment method has been added successfully.
//                     </p>
//                   </div>
//                 ) : (
//                   <AddCardForm
//                     onPaymentSuccess={handlePaymentSuccess}
//                     onPaymentError={handlePaymentError}
//                     setCardAddDialog={setShowCardForm}
//                   />
//                 )}
//               </>
//             )}
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "hugeicons-react";
import MyCard from "@/components/share/card/my-card";
import { useState } from "react";
import Image from "next/image";
import { StripeProvider } from "@/providers/stripe-provider";
import { useCards } from "@/hook";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { makePayment } from "@/services/api/payment";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useSocket } from "@/hook/useSocket";
import AddCardForm from "../add-card-form";

interface SendGiftProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSuccess: (tipAmount: number) => void;
  creatorId: string;
  roomId: string;
}

export const SendGift = ({
  open,
  setOpen,
  onSuccess,
  creatorId,
  roomId,
}: SendGiftProps) => {
  return (
    <StripeProvider>
      <SendGiftContent
        open={open}
        setOpen={setOpen}
        onSuccess={onSuccess}
        creatorId={creatorId}
        roomId={roomId}
      />
    </StripeProvider>
  );
};

const SendGiftContent = ({
  open,
  setOpen,
  onSuccess,
  creatorId,
  roomId,
}: SendGiftProps) => {
  const { cards, cardsLoading } = useCards();
  const [cardAddDialog, setCardAddDialog] = useState<boolean>(false);
  const [addCardSuccess, setAddCardSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing3DS, setProcessing3DS] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(0);

  const stripe = useStripe();
  const elements = useElements();
  const { isConnected } = useSocket(roomId);

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

    if (!tipAmount || tipAmount <= 0) {
      toast.error("Please enter a valid tip amount");
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
        amount: tipAmount,
        paymentType: "tips",
        currency: "eur",
        creatorId,
      });

      setLoading(false);

      if (response.success) {
        setPaymentSuccess(true);
        onSuccess(tipAmount); // Calls handleTipSuccess with isPaymentDone: true
        setTimeout(() => {
          setOpen(false);
          setPaymentSuccess(false);
          setTipAmount(0); // Reset tip amount
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
          onSuccess(tipAmount);
          setTimeout(() => {
            setOpen(false);
            setPaymentSuccess(false);
            setTipAmount(0); // Reset tip amount
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[412px] p-0">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex flex-col justify-center">
            {paymentSuccess ? (
              <div className="text-center py-2">
                <div className="text-green-500 text-xl mb-2">✓</div>
                <h3 className="text-lg font-medium">Tip Sent Successfully</h3>
                <p className="text-gray-500 mt-2">
                  Your tip of €{tipAmount.toFixed(2)} has been sent.
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
                  <span className="font-medium text-base mb-2">Send a Tip</span>
                  <span className="text-sm font-light text-neutral-600">
                    Enter the amount you’d like to tip:
                  </span>
                  <input
                    type="number"
                    value={tipAmount || ""}
                    onChange={(e) => setTipAmount(Number(e.target.value))}
                    className="mt-2 mx-auto w-24 text-center border rounded p-1"
                    min="1"
                    placeholder="€"
                    disabled={loading || processing3DS}
                  />
                </div>

                {(() => {
                  const defaultCard =
                    cards.find((item) => item.isDefault) || cards?.[0];
                  return (
                    <>
                      {cardsLoading ? (
                        <Skeleton className="mx-4 my-6 h-20" />
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
                          className="flex items-center justify-between mx-4 my-6 border rounded-[16px] p-1 cursor-pointer"
                          onClick={() => setCardAddDialog(true)}
                        >
                          <Button className="bg-white shadow-none text-sm text-brand-600 font-medium hover:bg-white rounded-[16px]">
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
                    className="py-2.5 text-sm font-medium w-[50%] bg-brand-50 text-brand-600 rounded-[24px]"
                    variant={"secondary"}
                    onClick={() => setOpen(false)}
                    disabled={loading || processing3DS}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="py-2.5 text-sm font-medium w-[50%] rounded-[24px]"
                    disabled={
                      !cards?.length ||
                      !tipAmount ||
                      tipAmount <= 0 ||
                      loading ||
                      processing3DS ||
                      !isConnected
                    }
                    onClick={handlePayment}
                    loading={loading}
                  >
                    Send Tip
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
              <h3 className="text-lg font-medium">Card Added</h3>
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
