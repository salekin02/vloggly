"use client";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRouter } from "next/navigation";
import MyCard from "@/components/share/card/my-card";
import TransactionHistory from "@/components/share/card/transaction-history";
import { Skeleton } from "@/components/ui/skeleton";
import { InboxIcon } from "hugeicons-react";

import { useCards } from "@/hook";

export default function CardList() {
  const router = useRouter();
  const { cards, cardsLoading, setDefaultCard, paymentHistory, removeCard } = useCards();

  const handleDeleteCard = async (id: string, callback: () => void) => {
    // Handle card deletion
    removeCard(id, {
      onSuccess: () => {
        callback();
      },
    });

  };
  const handleAddCard = () => {

    router.push("/card/add-new");

  };

  const handleEditCard = async (id: string, callback: () => void) => {
    // Handle editing a card
    setDefaultCard(id, {
      onSuccess: () => {
        callback();
      },
    });
  };

  return (
    <div className="w-full lg:w-[598px]">
      <div className="py-[14px] overflow-x-hidden rounded-3xl border bg-white border-[#0000000a]">
        <Tabs defaultValue="your_card" className="w-full gap-0 bg-white rounded-2xl">

          <TabsList className="w-full h-auto bg-white grid grid-cols-2 rounded-none p-0">
            <TabsTrigger
              value="your_card"
              className="cursor-pointer py-2 px-2.5 border-0 border-b-2 border-neutral-400 data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-600 rounded-none data-[state=active]:shadow-none"
            >
              Your card
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="cursor-pointer py-2 px-2.5 border-0 border-b-2 border-neutral-400 data-[state=active]:border-b-blue-600 data-[state=active]:text-blue-600 rounded-none data-[state=active]:shadow-none"
            >
              Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="your_card" className="p-4 pb-0">
            <div className="space-y-2.5">

              {cardsLoading ? <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
                :
                cards.length ?
                  cards.map((item, index) => <MyCard key={index} onDelete={handleDeleteCard} onEdit={handleEditCard} {...item} />)
                  :
                  <div className="py-8.5">
                    <div className="mx-auto flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full dark:bg-neutral-800">
                      <InboxIcon className="w-10 h-10 text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <div className="space-y-2 text-center">
                      <h2 className="text-xl font-semibold text-neutral-1000">No card available</h2>
                    </div>
                  </div>
              }

              {cards.length < 2 && <div className="mt-2.5 px-4 py-2.5">
                <Button
                  type="button"
                  variant="outline"
                  className="ml-auto flex h-10 rounded-full bg-[#E6F1FD] border-transparent text-brand-500 hover:text-brand-500 hover:bg-white hover:border-brand-500 active:shadow-[0px_0px_0px_4px_rgba(0,115,230,0.20)]"
                  onClick={handleAddCard}
                >
                  Add card
                </Button>
              </div>}
            </div>
          </TabsContent>

          <TabsContent value="payment" className="p-4 pb-0">
            {(() => {
              const defaultCard = cards.find(item => item.isDefault);
              return defaultCard ?
                <div className="mb-5">
                  <h5 className="py-2 font-semibold text-sm text-[#141B34]">Default Card</h5>
                  <MyCard {...defaultCard} id={defaultCard.id!} isPaymentCard />
                </div>
                : null;
            })()}
            <TransactionHistory paymentHistory={paymentHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
