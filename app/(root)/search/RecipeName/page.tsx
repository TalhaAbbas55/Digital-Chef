import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";

import { getRequestRecipe } from "@/lib/actions/recipes.action";

import BackToTop from "@/components/shared/BackToTop";
import SingleRecipeSearch from "@/components/shared/SingleRecipeSearch";
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

  const dishName = decodeURIComponent(searchParams.q || "");
  console.log(dishName, "here");

  if (dishName?.length > 0) {
    const url = `${process.env.NEXT_PUBLIC_SPOONACULAR_URL}/recipes/complexSearch?query=${dishName}&limitLicense=true&number=2&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`;
    response = await getRequestRecipe(url);
  }

  return (
    <section>
      <h1 className="head-text mb-10">Search by Ingredients</h1>

      <SingleRecipeSearch
        routeType="search/IngredientsBased"
        placeholder="Search Ingredients"
        count={response?.data.results?.length}
      />

      <div className="mt-14 flex flex-col gap-9">
        <RecipeContainer
          dishesData={response?.data.results || []}
          nameMode
          user={userInfo._id}
        />
      </div>

      {response?.data.results.length > 0 && <BackToTop />}
    </section>
  );
}

export default Page;
