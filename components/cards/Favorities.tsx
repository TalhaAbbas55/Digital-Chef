"use client";
import React, { useEffect, useState } from "react";
import RecipeHomeCard from "./RecipeHomeCard";
import { getRequestRecipe } from "@/lib/actions/recipes.action";
import { fetchUser, fetchUserSingle } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Loader } from "lucide-react";

const Favorities = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    checkUser();
  }, []);

  const checkUser = async () => {
    console.log(" i am ehre");
    const tempInfo = await fetchUserSingle(userId);
    setUserInfo(tempInfo);

    if (!tempInfo?.onboarded) redirect("/onboarding");
    let response = null;
    console.log(tempInfo?.favorites, "favorites");

    if (tempInfo?.favorites?.length > 0) {
      console.log("favorites");
      response = await getRequestRecipe(
        `${
          process.env.NEXT_PUBLIC_SPOONACULAR_URL
        }/recipes/informationBulk?ids=${tempInfo?.favorites?.join(
          ","
        )}&includeNutrition=false&apiKey=${
          process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY
        }`
      );
    }
    console.log(response, "response");
    console.log(response?.data?.length, "response?.data?.length");
    setFavorites(response?.data);
    setLoading(false);
  };
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "75vh",
        }}
      >
        <Loader size={40} className="animate-spin" color="white" />
      </div>
    );
  return favorites?.length > 0 ? (
    favorites?.map((dish: any, index: number) => (
      <div className="my-10">
        <RecipeHomeCard
          userId={userInfo?._id || ""}
          isFavorite={userInfo?.favorites?.includes(dish?.id) || false}
          key={index}
          dish={dish}
        />
      </div>
    ))
  ) : (
    <h1 className="text-light-1">No favorites yet</h1>
  );
};

export default Favorities;
