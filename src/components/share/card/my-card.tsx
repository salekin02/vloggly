"use client";

import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  CreditCardIcon,
  Delete02Icon,
  Edit02Icon,
  MoreHorizontalIcon,
} from "hugeicons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PaymentMethod } from "@/types";
import { Spinner } from "@/components/ui/spinner";

const cardLogos = {
  visa: "/assets/images/visa.svg",
  mastercard: "/assets/images/mastercard.svg",
  paypal: "/assets/images/paypal.svg",
};

export interface MyCardProps extends PaymentMethod {
  isPaymentCard?: boolean;
  setDefaultCard?: (value: string) => void;
  onDelete?: (id: string, callback: () => void) => void;
  onEdit?: (id: string, callback: () => void) => void;
}
const MyCard = ({
  id,
  card,
  isDefault,
  onEdit,
  isPaymentCard,
  onDelete,
}: MyCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { brand, last4, exp_month, exp_year } = card;

  const handleDelete = () => {
    setIsDeleting(true);
    if (onDelete) {
      onDelete(id, () => {
        setShowDeleteDialog(false);
        setIsDeleting(false);
      });
    }
  };

  const handleSetDefault = (checked: boolean) => {

    if (onEdit && !isDefault && checked) {
      setIsEditing(true);
      onEdit(id, () => {
        setIsEditing(false);
      });
    }
  };

  return (
    <div>
      <Card className="rounded-xl block px-4 py-3 shadow-none border border-neutral-300">
        <div className="flex justify-between items-start mb-2.5">
          <h3 className="text-sm font-semibold text-[#141B34]">{ }</h3>
          <Image
            src={cardLogos[brand as keyof typeof cardLogos]}
            alt="Visa"
            width={38}
            height={16}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-neutral-100 p-2.5 rounded-full border border-[#F2F2F2]">
            <CreditCardIcon size={20} color="#545454" />
          </div>
          <span className="text-neutral-800 text-sm">**** {last4}</span>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-neutral-800 text-sm font-[Inter]">
              Expiration date {exp_month}/{exp_year}
            </span>

            {!isPaymentCard && <DropdownMenu>
              <DropdownMenuTrigger className="text-neutral-800 cursor-pointer">
                <MoreHorizontalIcon size={24} strokeWidth={2.5} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="p-2 w-[260px] rounded-lg border-neutral-300 shadow-[0px_10px_20px_0px_rgba(21,21,21,0.04)]"
              >
                <DropdownMenuItem disabled className="font-medium hover:bg-[#F6F6F6] py-2.5 px-2 rounded-xs">
                  <Edit02Icon size={20} />
                  <span>Edit Address</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-medium hover:bg-[#F6F6F6] py-2.5 px-2 rounded-xs text-[#D80000] focus:text-[#D80000]"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Delete02Icon size={20} className="text-[#D80000]" />
                  <span>Delete Card</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>}
          </div>
        </div>
        {!isPaymentCard && (
          <>
            <Separator className="my-3 bg-neutral-300" />
            <div className="flex justify-between items-center p-1">
              <span className="font-medium text-xs text-neutral-1000">
                Active
              </span>

              {isEditing ?
                <Spinner size="sm" className="leading-3" />
                :
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900 text-sm">
                    Default
                  </span>
                  <Switch
                    checked={isDefault}
                    onCheckedChange={handleSetDefault}
                    className="data-[state=checked]:bg-blue-600 cursor-pointer"
                  />
                </div>
              }
            </div>
          </>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[412px] p-0 gap-5 rounded-[20px]">
          <div className="p-4 pb-1">
            <DialogHeader className="text-left gap-4 space-y-4">
              <DialogTitle className="text-base text-neutral-1000 font-medium mb-0">
                Remove this card
              </DialogTitle>
              <DialogDescription className="text-sm font-normal text-neutral-900">
                Are you sure you wish to remove this card from your payment
                method option?
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-1.5 mt-5">
              <div className="flex items-center justify-center bg-neutral-100 border border-[#F2F2F2] w-10 h-10 rounded-full">
                <Image
                  src={cardLogos[brand as keyof typeof cardLogos]}
                  alt={brand}
                  width={25}
                  height={8}
                />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-neutral-1000">
                  {new Date().toDateString()}
                </p>
                <p className="text-sm text-neutral-800">
                  Expiration date {exp_month}/{exp_year}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 p-4 border-t border-[#0000000a]">
            <Button
              type="button"
              variant="outline"
              className="text-sm font-medium flex-1 h-10 rounded-full bg-[#E6F1FD] border-transparent text-brand-500 hover:text-brand-500 hover:bg-white hover:border-brand-500 active:shadow-[0px_0px_0px_4px_rgba(0,115,230,0.20)]"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="text-sm font-medium flex-1 h-12 rounded-full bg-[#FF6161] hover:bg-brand-700 active:bg-brand active:shadow-[0px_0px_0px_4px_rgba(0,115,230,0.20)]"
              onClick={handleDelete}
            >
              {isDeleting ?
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Deleting...</span>
                </span>
                :
                "Yes, remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyCard;
