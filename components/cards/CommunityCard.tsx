import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";
import JoinCommunity from "../shared/JoinCommunity";
import { useId } from "react";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  userId: string;
  requests: string[];
  members: {
    image: string;
    _id: string;
  }[];
}

function CommunityCard({
  id,
  name,
  username,
  imgUrl,
  bio,
  members,
  userId,
  requests,
}: Props) {
  if (username === "asfksjfksdddd") {
    console.log(
      members.some((member) => {
        console.log(member._id);
        console.log(userId);
        return member._id.toString() === userId.toString();
      })
    );
  }
  return (
    <article className="community-card">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/communities/${id}`} className="relative h-12 w-12">
          <Image
            src={imgUrl}
            alt="community_logo"
            fill
            className="rounded-full object-cover"
          />
        </Link>

        <div>
          <Link href={`/communities/${id}`}>
            <h4 className="text-base-semibold text-light-1">{name}</h4>
          </Link>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
      {requests?.length > 0 && (
        <div className="ml-1    !text-tiny-medium text-light-2 flex justify-end ">
          <p className="bg-light-4 px-2 py-1 rounded">{`${requests?.length} pending to join`}</p>
        </div>
      )}

      <p className="mt-4 text-subtle-medium text-gray-1">{bio}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/communities/${id}`}>
          <Button size="sm" className="community-card_btn">
            View
          </Button>
        </Link>

        {members.length > 0 && (
          <div className="flex items-center">
            {members.map((member, index) => (
              <Image
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={28}
                height={28}
                className={`${
                  index !== 0 && "-ml-2"
                } rounded-full object-cover`}
              />
            ))}
            {members.length > 3 && (
              <p className="ml-1 text-subtle-medium text-gray-1">
                {members.length}+ Users
              </p>
            )}
          </div>
        )}
      </div>
      {!requests?.includes(userId) &&
        !members.some(
          (member) => member._id.toString() === userId.toString()
        ) && <JoinCommunity communityId={id} userId={userId} />}
    </article>
  );
}

export default CommunityCard;
