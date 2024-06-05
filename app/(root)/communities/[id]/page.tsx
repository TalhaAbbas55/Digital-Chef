import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

import { communityTabs } from "@/constants";

import UserCard from "@/components/cards/UserCard";
import ThreadsTab from "@/components/shared/ThreadsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import InvitationCard from "@/components/cards/invitationCard";
import { fetchUser } from "@/lib/actions/user.actions";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();

  const userInfo = await fetchUser(user?.id);

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails?.createdBy?.id}
        authUserId={user?.id || ""}
        name={communityDetails?.name}
        username={communityDetails?.username}
        imgUrl={communityDetails?.image}
        bio={communityDetails?.bio}
        type="Community"
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => {
              return (
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
                      {communityDetails?.threads?.length}
                    </p>
                  )}
                  {tab.label === "Requests" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {communityDetails.requests.length}
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="threads" className="w-full text-light-1">
            {/* @ts-ignore */}
            <ThreadsTab
              currentUserId={user?.id || ""}
              accountId={communityDetails._id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members" className="mt-9 w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              {communityDetails?.members?.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests" className="w-full text-light-1">
            {/* @ts-ignore */}
            <section className="mt-9 flex flex-col gap-10">
              {communityDetails?.requests?.map((member: any) => (
                <InvitationCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  owner={
                    communityDetails.createdBy._id.toString() ===
                    userInfo?._id.toString()
                  }
                  personType="User"
                  communityId={communityDetails?._id}
                  communitySimpleId={communityDetails?.id}
                />
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
