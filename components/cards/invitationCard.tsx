"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import {
  addMemberToCommunity,
  cancelRequestToJoin,
} from "@/lib/actions/community.actions";
import { Loader } from "lucide-react";
import "./styles.css";
interface Props {
  key: string;
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
  owner: boolean;
  communityId: string;
  communitySimpleId: string;
}

const InvitationCard = ({
  key,
  id,
  name,
  username,
  imgUrl,
  personType,
  owner,
  communityId,
  communitySimpleId,
}: Props) => {
  console.log(communityId, communitySimpleId, "e");
  const [loading, setLoading] = useState(false);
  const { organization } = useOrganization();
  console.log(organization, "org");
  const [reject, setReject] = useState(false);
  const [accept, setAccept] = useState(false);
  const router = useRouter();
  const cancelRequest = async () => {
    setLoading(true);
    const res = await cancelRequestToJoin({
      communityId,
      userId: id,
    });
    setLoading(false);
    setReject(true);

    console.log(res, "ehe");
  };

  const acceptRequest = async () => {
    const response = await organization?.addMember({
      userId: id,
      role: "org:member",
    });
    console.log(response, "response to join");
    await cancelRequestToJoin({
      communityId,
      userId: id,
    });
    const res = await addMemberToCommunity(communitySimpleId, id, true);
    setLoading(false);
    setAccept(true);
    console.log(res, "here");
  };

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={imgUrl}
          alt={name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      {reject ? (
        <Button
          className="user-card_btn"
          onClick={() => router.push(`/profile/${id}`)}
          disabled
        >
          Rejected
        </Button>
      ) : owner ? (
        accept ? null : (
          <>
            <Button
              className="user-card_btn"
              onClick={acceptRequest}
              disabled={loading}
            >
              {loading ? (
                <Loader size={20} className="animate-spin" color="white" />
              ) : (
                "Accept"
              )}
            </Button>
            <Button
              className="user-card_btn dangerButton"
              onClick={cancelRequest}
              style={{ backgroundColor: "red" }}
            >
              {!loading ? (
                " Reject"
              ) : (
                <Loader size={20} className="animate-spin" color="white" />
              )}
            </Button>
          </>
        )
      ) : (
        <Button
          className="user-card_btn"
          onClick={() => router.push(`/profile/${id}`)}
          disabled
        >
          Pending
        </Button>
      )}
    </article>
  );
};

export default InvitationCard;
