"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMassageStore } from "@/data";
import { PlusSignIcon, CircleIcon } from "hugeicons-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
export const SavedList = () => {
  const [openAddList, setAddList] = useState<boolean>(false);

  const { savedList, addSavedList, savedDialogOpen, SetSavedDialogOpen } =
    useMassageStore();

  const [formData, setFormData] = useState({
    name: "",
    users: "",
    posts: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGroup = {
      id: Date.now().toString(),
      name: formData?.name,
      users: 1,
      posts: 0,
    };
    addSavedList(newGroup);
    setAddList(false);
  };
  return (
    <>
      {/* Main dialoge  */}

      <Dialog open={savedDialogOpen} onOpenChange={SetSavedDialogOpen}>
        <DialogContent className="w-[519px] p-0">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="border-b py-4 px-6 w-full">
            <span className="font-medium">Saved List</span>
          </div>
          {savedList.length === 0 ? (
            <div className="flex flex-col justify-center px-6 h-[300px]">
              <div className="grid text-center">
                <span className="font-medium mb-2">
                  Oops no Saved list Available!
                </span>
                <span className="text-sm font-normal mb-3">
                  {`Looks like there isn't any saved list here ath the moment
                  check back later or create on now`}
                </span>
              </div>
              <Button
                className="bg-white shadow-none text-sm text-brand-600 font-medium hover:bg-white focus-visible:ring-0 focus:outline-none hover:outline-none"
                onClick={() => setAddList(!openAddList)}
              >
                <PlusSignIcon size={13} /> Saved List
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <div className="px-6 place-items-start h-[244px]">
                <RadioGroup defaultValue={savedList[0]?.name}>
                  {savedList?.map((list) => (
                    <div className="flex items-start space-x-2" key={list?.id}>
                      <RadioGroupItem
                        value={list?.name}
                        id={`radio-${list?.id}`}
                        className="outline-none"
                      />
                      <div className="space-y-2">
                        <Label
                          htmlFor={`radio-${list?.id}`}
                          className="text-base font-medium"
                        >
                          <span className="leading-none">{list?.name}</span>
                        </Label>
                        <div className="flex gap-2 items-center">
                          <span className="leading-none text-sm font-normal">
                            {list?.users} users
                          </span>
                          <CircleIcon size={7} fill="#f5f5f5" color="#f5f5f5" />
                          <span className="leading-none text-sm font-normal">
                            {list?.posts} posts
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="px-2 py-4 border-t border-border w-full">
                <Button
                  className="bg-white shadow-none text-sm text-brand-600 font-medium hover:bg-white focus-visible:ring-0 focus:outline-none hover:outline-none"
                  onClick={() => setAddList(!openAddList)}
                >
                  <PlusSignIcon size={13} /> Add Colection
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add new list disalog */}
      <Dialog open={openAddList} onOpenChange={setAddList}>
        <DialogContent className="w-[454px] h-[194px] p-0 items-start gap-0">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="border-b py-4 px-4">
            <span className="font-medium">Saved List</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-4 border-b">
              <Input
                className="bg-[#fafafa] focus-visible:ring-0 focus:outline-none rounded-full"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="py-4 px-4">
              <Button
                type="submit"
                disabled={!formData?.name}
                className="text-sm font-medium py-2.5 px-10 rounded-full focus-visible:ring-0 focus:outline-none hover:outline-none"
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
