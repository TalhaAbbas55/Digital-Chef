"use client";
import { likeThread } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import React, { useState } from "react";
interface Props {
  currentUserId: string;
  parentId: string | null;
  authorName: string;
  authorImage: string;
  threadId: string;
  likes: string[];
}
const LikeThread = ({
  currentUserId,
  parentId,
  authorImage,
  authorName,
  threadId,
  likes,
}: Props) => {
  const [likesCount, setLikesCount] = useState({
    count: likes.length,
    isLiked: likes.includes(currentUserId),
  });

  const handleLikeThread = async () => {
    const likes = await likeThread(threadId, currentUserId);
    setLikesCount({
      count: likes,
      isLiked: !likesCount.isLiked,
    });
  };
  return (
    <div onClick={handleLikeThread} className="flex gap-1 text-light-1">
      {likesCount.count > 0 && likesCount.count}
      <Image
        src={
          likesCount.isLiked
            ? "/assets/heart-filled.svg"
            : "/assets/heart-gray.svg"
        }
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
      />
    </div>
  );
};

export default LikeThread;
