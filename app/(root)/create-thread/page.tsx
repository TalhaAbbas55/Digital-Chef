import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
interface Props {
  searchParams: {
    repost?: boolean;
    content: string;
    author: string;
    community: string;
  };
}
const page = async ({ searchParams }: Props) => {
  const { repost, content, author, community } = searchParams;
  const userData = await currentUser();
  console.log(userData, "datasss 1");

  if (!userData) redirect("/sign-in");

  const userInfo = await fetchUser(userData.id);

  if (!userInfo?.onboarded) redirect("/onboarding");
  return (
    <>
      <h1 className="head-text">Create Thread</h1>

      <PostThread
        userId={userData.id}
        repost={repost || false}
        content={content}
        community={community}
        author={author}
      />
    </>
  );
};

export default page;
