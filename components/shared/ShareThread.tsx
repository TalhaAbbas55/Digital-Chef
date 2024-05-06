"use client";
import Image from "next/image";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const ShareThread = ({ threadUrl }: { threadUrl: string }) => {
  const { toast } = useToast();
  const copyUrl = () => {
    navigator.clipboard
      .writeText(threadUrl)
      .then(() => {
        toast({
          title: "The link copied to clipboard",
          description: "Now you can share it with your friends",
          duration: 1500,
        });
        console.log("Copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying to clipboard: ", error);
      });
  };
  return (
    <Image
      onClick={copyUrl}
      src="/assets/share.svg"
      alt="heart"
      width={24}
      height={24}
      className="cursor-pointer object-contain"
    />
  );
};

export default ShareThread;
