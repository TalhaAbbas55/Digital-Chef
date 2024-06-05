"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { setUserOnboardedToFalse } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: "User" | "Community";
}
const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
}: Props) => {
  const router = useRouter();
  const handleEdit = async () => {
    console.log("Edit");
    const res = await setUserOnboardedToFalse({ userId: authUserId });
    router.push("/onboarding");
    console.log(res);
  };
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="profile"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="tex-lef text-heading3-bold text-light-1">{name}</h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
        <Button className="user-card_btn" onClick={handleEdit}>
          Edit
        </Button>
      </div>
      <p className="mt-6 max-w-lg text-base regular text-light-2">{bio}</p>
      <div className="mt-12 h-0 5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
