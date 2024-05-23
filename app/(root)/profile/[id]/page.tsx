import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const userData = await currentUser();
  console.log(userData, "daadata 1");

  if (!userData) redirect("/sign-in");

  const userInfo = await fetchUser(params.id);

  if (!userInfo?.onboarded) redirect("/onboarding");
  return (
    <>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={userData.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Posts" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.value}`}
              value={tab.value}
              className="w-full text-light-1"
            >
              {/* Ensure that you render the appropriate component based on the tab value */}
              {tab.value === "posts" && (
                <ThreadsTab
                  currentUserId={userData.id}
                  accountId={userInfo.id}
                  accountType="User"
                />
              )}
              {/* Render other tab content components similarly based on 'tab.value' */}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default page;
