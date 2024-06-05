import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import RecipeSearch from "@/components/shared/RecipeSearch";
import { useEffect } from "react";
import { getRequestRecipe } from "@/lib/actions/recipes.action";
import RecipeCard from "@/components/cards/RecipeCard";
import { Recipe } from "@/lib/interfaces";

import BackToTop from "@/components/shared/BackToTop";

import { apiUrls } from "@/lib/apiUrls";
import RecipeContainer from "@/components/cards/RecipeContainer";
interface SearchParams {
  [key: string]: string | undefined;
}

async function Page({ searchParams }: { searchParams: SearchParams }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  let response;

  const Ingredients: string = decodeURIComponent(searchParams.q || "");

  if (Ingredients?.length > 0) {
    response = await getRequestRecipe(
      `${process.env.NEXT_PUBLIC_SPOONACULAR_URL}${apiUrls.GET_BY_INGREDIENTS}${Ingredients}&limitLicense=true&number=2&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`
    );
  }

  return (
    <section>
      <RecipeSearch
        routeType="search/IngredientsBased"
        placeholder="Search Ingredients"
        count={response?.data?.length}
      />

      <div className="mt-14 flex flex-col gap-9">
        <RecipeContainer
          dishesData={response?.data || []}
          nameMode={false}
          user={userInfo._id}
        />
      </div>

      {response?.data?.count > 0 && <BackToTop />}
    </section>
  );
}

export default Page;
