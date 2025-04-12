"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMassageStore } from "@/data";
import { useState } from "react";
export const Popup_Report_Block_Delete = () => {
  const { popUpactions, popUpOpen, setPopupOpen } = useMassageStore();
  const [radioValue, setRadioValue] = useState<string>("");
  const radioOptions = [
    { id: 1, option: "Sending harmful or Abusive massages" },
    { id: 2, option: "Sharing misleading or false information" },
    { id: 3, option: "Posting offencive or inappropriate content" },
    { id: 4, option: "Pretending to be someone else" },
    { id: 5, option: "Others" },
  ];
  const handleRadio = (value: string) => {
    setRadioValue(value);
  };

  return (
    <Dialog open={popUpOpen} onOpenChange={setPopupOpen}>
      <DialogContent className="w-[412px] p-0">
        <DialogTitle className="hidden"></DialogTitle>

        {/* All dialogues conditinally rendered  */}
        {popUpactions.isReport ? (
          <div className="flex flex-col justify-center pt-6">
            <div className="flex flex-col px-4">
              <span className="font-medium text-black text-base mb-2">
                Are you sure you want to report this account?
              </span>
              <span className="text-sm font-normal text-neutral-700">
                {`Let us know why you are reporting this account.
                We will review the report and take appropriate actions.`}
              </span>
              <div className="mt-5 mb-6">
                <RadioGroup
                  defaultValue={radioValue}
                  onValueChange={(value) => handleRadio(value)}
                >
                  {radioOptions.map((option) => (
                    <div
                      className="flex items-start space-x-2"
                      key={option?.id}
                    >
                      <RadioGroupItem
                        value={option?.option}
                        id={`radio-${option?.id}`}
                        className="outline-none border-4 border-border"
                      />
                      <div className="space-y-2">
                        <Label
                          htmlFor={`radio`}
                          className="text-base font-medium"
                        >
                          <span className="leading-none text-sm font-normal text-neutral-900">
                            {option?.option}
                          </span>
                        </Label>
                      </div>
                    </div>
                  ))}
                  {radioValue === "Others" && (
                    <textarea
                      placeholder="Enter your report"
                      className="h-[83px] bg-neutral-100 border border-border rounded-[2px] py-2 px-2.5"
                    ></textarea>
                  )}
                </RadioGroup>
              </div>
            </div>
            <div className="py-4 flex gap-2 justify-center border-t border-border px-4">
              <Button
                className="py-2.5 text-sm font-medium w-[50%] bg-brand-50 text-brand-600 rounded-[24]"
                variant={"secondary"}
                onClick={() => {
                  setPopupOpen(false);
                  setRadioValue("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="py-2.5 text-sm font-medium w-[50%] rounded-[24]"
                disabled={!radioValue}
                onClick={() => {
                  setPopupOpen(false);
                  setRadioValue("");
                }}
              >
                Report
              </Button>
            </div>
          </div>
        ) : popUpactions.isBlock ? (
          <div className="flex flex-col justify-center pt-6">
            <div className="flex flex-col px-4 mb-6 text-center">
              <span className="font-medium text-black text-base mb-2">
                Are You Sure You Want to Block This User?
              </span>
              <span className="text-sm font-normal text-neutral-700">
                {` Blocked contacts will no longer be able to call you or send you messages. This contact
                will not be notified`}
              </span>
            </div>
            <div className="py-4 flex gap-2 justify-center border-t border-border px-4">
              <Button
                className="py-2.5 text-sm font-medium w-[50%] bg-brand-50 text-brand-600 rounded-[24]"
                variant={"secondary"}
                onClick={() => setPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="py-2.5 text-sm font-medium w-[50%] rounded-[24]"
                onClick={() => setPopupOpen(false)}
              >
                Block
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center pt-6">
            <div className="flex flex-col px-4 mb-6 text-center">
              <span className="font-medium text-black text-base mb-2">
                Are You Sure You Want to Delete This Chat?
              </span>
              <span className="text-sm font-normal text-neutral-700">
                {` Deleting this chat
                will erase all messages permanently. This cannot be reversed.`}
              </span>
            </div>
            <div className="py-4 flex gap-2 justify-center border-t border-border px-4">
              <Button
                className="py-2.5 text-sm font-medium w-[50%] bg-brand-50 text-brand-600 rounded-[24]"
                variant={"secondary"}
                onClick={() => {
                  setPopupOpen(false);
                  setRadioValue("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="py-2.5 text-sm font-medium w-[50%] rounded-[24]"
                onClick={() => setPopupOpen(false)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
