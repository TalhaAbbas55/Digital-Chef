import Favorities from "@/components/cards/Favorities";
import RecipeCard from "@/components/cards/RecipeCard";
import RecipeHomeCard from "@/components/cards/RecipeHomeCard";
import { getRequestRecipe } from "@/lib/actions/recipes.action";

import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const userData = await currentUser();
  console.log(userData, "datasAa 1");

  if (!userData) redirect("/sign-in");

  return (
    <>
      <h1 className="head-text mb-10">Favorites</h1>
      <Favorities userId={userData.id} />
    </>
  );
};

export default page;
