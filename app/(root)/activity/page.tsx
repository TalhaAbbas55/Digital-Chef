import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { formatDateString } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const userData = await currentUser();

  if (!userData) redirect("/sign-in");

  const userInfo = await fetchUser(userData.id);

  // get activity from user

  const activity = await getActivity(userInfo._id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity.id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card cursor-pointer flex justify-between">
                  <div
                    className="flex "
                    style={{ alignItems: "center", gap: 4 }}
                  >
                    <Image
                      src={activity.author.image}
                      alt={activity.author.name}
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activity.author.name}
                      </span>{" "}
                      replied to you
                    </p>
                  </div>
                  <p style={{ color: "white" }}>
                    {formatDateString(activity.createdAt)}
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default page;
