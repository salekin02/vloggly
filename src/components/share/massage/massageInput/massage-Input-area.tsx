"use client";

import { useEffect, useState } from "react";
import {
  ImageCompositionOvalIcon,
  DollarCircleIcon,
  TextFontIcon,
  SentIcon,
  MultiplicationSignIcon,
} from "hugeicons-react";
import { useMassageStore } from "@/data";
import { MessageView } from "../massageView";
import { Input } from "@/components/ui/input";
import { ImageInput } from "./ImageInput";
import { SendGift } from "./sendGiftModal";
import { TextFormatter } from "./text-formatter";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { useSocket } from "@/hook/useSocket";
import { uploadFiles } from "@/services/api/file-upload";
import { toast } from "sonner";

interface UploadedFile {
  url: string;
  type: "image" | "video";
  file: File;
}

interface MassageTypingAreaProps {
  roomId: string | null;
  creatorId: string;
}

export const MassageTypingArea = ({
  roomId,
  creatorId,
}: MassageTypingAreaProps) => {
  const { setIsReplied, isReplied, replying } = useMassageStore();
  const {
    messages,
    isConnected,
    sendMessage,
    sendFile,
    startTyping,
    stopTyping,
  } = useSocket(roomId);
  const [images, setImage] = useState<File[]>([]);
  const [isGif, setIsgif] = useState<boolean>(false);
  const [isSendGift, setIsSendGift] = useState<boolean>(false);
  const [isFormat, setIsformat] = useState<boolean>(false);
  const [isSending, setIsSending] = useState(false);

  // Log socket connection changes
  useEffect(() => {
    console.log("Socket connection status:", { isConnected, roomId });
  }, [isConnected, roomId]);

  const replyingMessage = messages.find((msg) => msg._id === replying.targetId);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Type a message...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "<p></p>",
    onUpdate: () => isConnected && startTyping(),
    onBlur: () => isConnected && stopTyping(),
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleSend();
          return true;
        }
        return false;
      },
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isConnected || !e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (files.length !== validImages.length) {
      toast.error(
        "Only images are allowed. Videos and other file types are not supported."
      );
    }

    if (validImages.length > 0) {
      setImage((prev) => [...prev, ...validImages]);
      setIsgif(false);
      setIsformat(false);
    }

    if (e.target) e.target.value = "";
  };

  const handleDeleteImage = (index: number) => {
    setImage((prev) => prev.filter((_, i) => i !== index));
  };

  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  useEffect(() => {
    if (images.length > 0) {
      setUploadProgress(new Array(images.length).fill(0));
    } else {
      setUploadProgress([]);
    }
  }, [images.length]);

  const handleSend = async () => {
    if (!isConnected || isSending) return;

    const content = editor?.getHTML();
    const hasText = content && content !== "<p></p>";
    const hasImages = images.length > 0;

    if (hasText || hasImages) {
      setIsSending(true);
      try {
        if (hasText) {
          sendMessage({
            message: content!,
            type: "text",
            creatorId: creatorId,
          });
        }

        if (hasImages) {
          console.log(
            "Starting file upload for:",
            images.map((f) => f.name)
          );
          const uploadResponse = await uploadFiles(images, "post", {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 90) / progressEvent.total
                );
                console.log("Upload progress:", percentCompleted);
                setUploadProgress(
                  new Array(images.length).fill(percentCompleted)
                );
              }
            },
          });

          console.log("uploadFiles response:", uploadResponse);

          if (!uploadResponse.success || !uploadResponse.data) {
            throw new Error(uploadResponse.message || "File upload failed");
          }

          setUploadProgress(new Array(images.length).fill(100));

          const uploadedFiles: UploadedFile[] = images.map((file, index) => ({
            url: uploadResponse.data[index].url,
            type: "image",
            file,
          }));

          for (const file of uploadedFiles) {
            sendFile(
              file.url,
              file.type,
              creatorId,
              hasText ? content : undefined
            );
          }
          toast.success("Images uploaded successfully!");
        }

        editor?.commands.clearContent();
        setImage([]);
        setIsReplied(false);
        setIsgif(false);
        setIsSendGift(false);
        setIsformat(false);
        stopTyping();
        editor?.chain().focus();
        setTimeout(() => window.dispatchEvent(new Event("resize")), 500);
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error(
          `Failed to upload images: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleTipSuccess = (tipAmount: number) => {
    if (!isConnected) {
      console.error("Cannot send tip: Socket not connected.");
      return;
    }

    sendMessage({
      message: `Tip: $${tipAmount.toFixed(2)}`,
      type: "tips",
      creatorId: creatorId,
      isPaid: true,
      price: tipAmount,
      isPaymentDone: true,
    });
  };

  return (
    <>
      {isReplied && replyingMessage && (
        <div className="absolute bottom-[150px] w-[94.5%] bg-white p-4 mx-4 rounded-[8px] z-100">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-normal text-neutral-600">Reply</span>
            <MultiplicationSignIcon
              size={16}
              onClick={() => setIsReplied(false)}
              className="cursor-pointer"
            />
          </div>
          <div className="p-2 bg-neutral-200 rounded-[8px]">
            <span className="text-base font-normal">
              <MessageView
                message={replyingMessage.text || ""}
                date={new Date(replyingMessage.sendAt).toISOString()}
                id={replyingMessage._id}
                sender={
                  replyingMessage.senderType === "subscriber"
                    ? "user"
                    : "receiver"
                }
                receiver={
                  replyingMessage.senderType === "subscriber"
                    ? "receiver"
                    : "user"
                }
                Liked={false}
                replied={false}
                imageUrl={replyingMessage.imageUrl}
                replying={true}
              />
            </span>
          </div>
        </div>
      )}

      <div className="bg-[#fafafa] rounded-[20px] mb-17.5 mx-4 lg:m-4 p-4">
        {images.length > 0 && (
          <ImageInput
            images={images}
            onImageUpload={handleImageUpload}
            onDelete={handleDeleteImage}
            setImage={setImage}
            uploadProgress={uploadProgress}
            isSending={isSending}
          />
        )}
        <SendGift
          open={isSendGift}
          setOpen={setIsSendGift}
          onSuccess={handleTipSuccess}
          creatorId={creatorId}
          roomId={roomId || ""}
        />

        <EditorContent
          className={`
            ${images.length > 0 || isGif ? "py-3" : "p-0"}
            w-full resize-none text-neutral-800 outline-none
            ${images.length > 0 || isGif || isFormat ? "min-h-[60px]" : "min-h-[60px] lg:min-h-[80px]"}
            rounded-lg focus:outline-none
            [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
            [&_.is-editor-empty:first-child::before]:text-gray-400
            [&_.is-editor-empty:first-child::before]:float-left
            [&_.is-editor-empty:first-child::before]:h-0 [&:focus]:ring-0 [&:focus]:border-gray-200
            [&_.ProseMirror]:focus:outline-none
          `}
          editor={editor}
          disabled={!isConnected || isSending}
        />
        {isFormat && (
          <TextFormatter editor={editor} setIsformat={setIsformat} />
        )}
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center">
            <label className="flex items-center">
              <ImageCompositionOvalIcon
                className="cursor-pointer"
                color={images.length > 0 ? "#0069d1" : ""}
              />
              <Input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={!isConnected || isSending}
                multiple
              />
            </label>
            <DollarCircleIcon
              onClick={() => setIsSendGift(true)}
              color={isSendGift ? "#0069d1" : ""}
              className="cursor-pointer"
            />
            <TextFontIcon
              className="cursor-pointer"
              color={isFormat ? "#0069d1" : ""}
              onClick={() => setIsformat(!isFormat)}
            />
          </div>
          <div
            className={`rounded-full p-2.5 relative cursor-pointer ${
              isConnected && !isSending
                ? "bg-brand-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={isConnected && !isSending ? handleSend : undefined}
          >
            {isSending ? (
              <div className="w-[15px] h-[15px] animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <SentIcon size={15} color="white" strokeWidth="2.5" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
