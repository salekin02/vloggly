"use client";


import { useState, useEffect } from "react";
import { MassageList } from "@/components/share/massage/massage-list";
import { useMassageStore } from "@/data";
import { ChatRoom } from "@/types/chat-room";
import { fetchSubscriberRooms } from "@/services";
import { MassageBody } from "@/components/share/massage/massge-body";

export default function Massage() {
  const { isMobile, setIsMobile, clickedMsg } = useMassageStore();
  const [selectedChatroom, setSelectedChatroom] = useState<ChatRoom | null>(
    null
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  useEffect(() => {
    const syncSelectedChatroom = async () => {
      if (clickedMsg) {
        try {
          const response = await fetchSubscriberRooms();
          if (response.success) {
            const room = response.data.find(
              (r: ChatRoom) => r.roomId === clickedMsg
            ) as ChatRoom | undefined;
            setSelectedChatroom(room || null);
          } else {
            console.error("Failed to fetch rooms:", response.message);
            setSelectedChatroom(null);
          }
        } catch (error) {
          console.error("Error syncing chatroom:", error);
          setSelectedChatroom(null);
        }
      } else {
        setSelectedChatroom(null);
      }
    };
    syncSelectedChatroom();
  }, [clickedMsg]);

  const handleBackClick = () => {
    setSelectedChatroom(null);
  };

  return (
    <div className={`h-full ${isMobile ? " w-full" : ""} overflow-hidden`}>
      {/* Mobile view: Show MassageList or MassageBody */}
      {/* <div className="block lg:hidden w-full h-full flex-col">
        {isMobile && selectedChatroom ? (
          <MassageBody
            chatroom={selectedChatroom}
            isMobile={isMobile}
            onBackClick={handleBackClick}
          />
        ) : (
          <MassageList />
        )}
      </div> */}
      {/* ====================================================================== */}
      {/* my area  */}
      <div className="block lg:hidden h-full flex-col">
        {isMobile && selectedChatroom ? (
          <MassageBody
            chatroom={selectedChatroom}
            isMobile={isMobile}
            onBackClick={handleBackClick}
          />
        ) : (
          <MassageList />
        )}
      </div>
      {/* Desktop view: Show both MassageList and MassageBody */}
      {/* <div className="h-full"> */}
      {/* Mobile view: Show only MassageList initially */}
      {/* <div className="block lg:hidden w-full ">
          <div className="w-screen">
            <MassageList />
          </div>
        </div> */}
      {/* Desktop view: Show both MassageList and MassageBody */}
      <div className="hidden lg:block h-full">
        <div className="flex h-full border border-border lg:rounded-[20px] bg-white">
          <div className="border-r border-border">
            <MassageList />
          </div>
          <div className="bg-brand-50 rounded-tr-[20px] rounded-br-[20px] flex-1">
            {selectedChatroom ? (
              <MassageBody
                chatroom={selectedChatroom}
                isMobile={isMobile}
                onBackClick={handleBackClick}
              />
            ) : (
              <div className="flex items-center justify-center h-full lg:w-[593px]">
                <p className="text-gray-500">
                  Select a chatroom to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    // {/* ====================================================================== */}
    // {/* my area  */}
    //   <div className="hidden lg:block h-full">
    //     <div className="flex h-full border border-border rounded-[20px] bg-white p-1 overflow-visible">
    //       <div className="border-r border-border rounded-l-[20px] lg:min-w-[360px]">
    //         <MassageList />
    //       </div>
    //       <div className="bg-brand-50 rounded-tr-[20px] rounded-br-[20px] flex-1">
    //         {selectedChatroom ? (
    //           <MassageBody
    //             chatroom={selectedChatroom}
    //             isMobile={isMobile}
    //             onBackClick={handleBackClick}
    //           />
    //         ) : (
    //           <div className="flex items-center justify-center h-full lg:w-[593px]">
    //             <p className="text-gray-500">
    //               Select a chatroom to start chatting
    //             </p>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
