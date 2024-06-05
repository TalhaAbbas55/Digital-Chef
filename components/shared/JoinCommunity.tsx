"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { requestToJoin } from "@/lib/actions/community.actions";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
const JoinCommunity = ({ communityId, userId }) => {
  const [loading, setLoading] = useState(false);
  const [join, setJoin] = useState(false);
  console.log(userId, "id");
  const router = useRouter();
  const handleRequest = async () => {
    try {
      setLoading(true);
      await requestToJoin({ communityId, userId });
      setJoin(true);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
  if (join) {
    return null;
  }
  return (
    <div className="flex justify-center">
      <Button
        size="sm"
        className="community-card_btn "
        onClick={handleRequest}
        disabled={loading}
      >
        {loading ? (
          <Loader size={20} className="animate-spin" color="white" />
        ) : (
          " Join"
        )}
      </Button>
    </div>
  );
};

export default JoinCommunity;
