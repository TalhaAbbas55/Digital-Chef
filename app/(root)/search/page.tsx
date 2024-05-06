import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";

import SearchMode from "@/components/cards/SearchMode";
import { getRecipeInfoByUri } from "@/lib/actions/recipes.action";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section className="h-full">
      <h1 className="head-text mb-10">Search</h1>

      <div className="flex justify-between h-full gap-10 mb-5">
        <SearchMode label="Search by Ingredients" mode="IngredientsBased" />
        <SearchMode label="Search by Recipe Name" mode="RecipeName" />
      </div>

      <h4 className="head-text text-center">Pick one from here</h4>
    </section>
  );
}

export default Page;
