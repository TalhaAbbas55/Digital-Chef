"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";
import { Recipe, SingleRecipe } from "@/lib/interfaces";
import AddtoFavorites from "@/public/assets/favorites-star-svgrepo-com";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setRecipeData } from "@/lib/redux/DataSlice";
import { toggleFromFavorites } from "@/lib/actions/user.actions";
import { useState } from "react";
import "./styles.css";
import { capitalizeFirstLetterOfWords } from "@/lib/utils";
import { redirect } from "next/navigation";

function RecipeCard({
  userId,
  isFavorite,
  dish,
  name,
}: // dish,
SingleRecipe) {
  console.log(dish, "dish");

  const router = useRouter();
  const dispatch = useDispatch();
  const [favorite, setfavorite] = useState(isFavorite);

  const navigateRoute = () => {
    if (!userId) redirect("/sing-in");
    router.push(`/search/SingleRecipe/${dish.id}?current=${userId}`);
  };
  const handleAddToFavorites = async () => {
    console.log(userId, "userId");
    const response = userId && (await toggleFromFavorites(userId, dish.id));

    console.log(response, "response");
    setfavorite(!favorite);
  };
  return (
    <article className="community-card w-full">
      {!name && (
        <>
          <div
            className="text-light-1 flex justify-end gradient-text"
            style={{ fontSize: "24px" }}
          >
            {dish?.usedIngredientCount} ingredient
            {dish?.usedIngredientCount > 1 ? "s" : ""} match
          </div>
          <div
            className="text-light-1 flex justify-end gradient-text"
            style={{ fontSize: "24px", marginBottom: "-35px" }}
          >
            {dish?.missedIngredientCount} other ingredient
            {dish?.missedIngredientCount > 1 ? "s" : ""}
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex w-full justify-between items-center">
          <Image
            src={dish?.image || ""}
            alt="community_logo"
            // fill
            className="rounded-full object-cover"
            height={300}
            width={300}
          />
          <div
            className="flex  w-full mr-5"
            style={{ justifyContent: "space-around" }}
          >
            <h4
              className="text-base-semibold text-light-1 "
              style={{ textAlign: "end", fontSize: "24px" }}
            >
              {dish.title}
            </h4>
          </div>
        </div>
      </div>
      <div
        className="cursor-pointer flex justify-end"
        onClick={handleAddToFavorites}
      >
        <AddtoFavorites fill={favorite ? "yellow" : "#fff"} />
      </div>

      {!name && (
        <>
          <h1 className=" text-light-2 mt-4 head-text mb-5">
            {" "}
            All Ingredients
          </h1>
          <div className="grid-container">
            {[...dish.usedIngredients, ...dish?.missedIngredients]?.map(
              (ingredient, index) => (
                <div
                  className="grid-item flex "
                  style={{ flexDirection: "column", alignItems: "center" }}
                  key={index}
                >
                  <Image
                    src={ingredient.image || ""}
                    alt="community_logo"
                    className="rounded-full object-cover mx-auto mb-4"
                    height={100}
                    width={100}
                    style={{ maxHeight: "120px", maxWidth: "120px" }}
                  />
                  <h6
                    className="text-base-semibold text-light-1"
                    style={{ textAlign: "center", fontSize: "20px" }}
                  >
                    {capitalizeFirstLetterOfWords(ingredient.name)}
                  </h6>
                  <div className="flex mt-2 justify-center ">
                    <p
                      className="text-light-1 mr-2 "
                      style={{ fontSize: "18px", alignItems: "center" }}
                    >
                      {ingredient?.amount && ingredient.amount.toFixed(1)}
                    </p>
                    <p className="text-light-1">{ingredient?.unitLong}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}

      <div
        className="mt-5 flex "
        style={{ justifyContent: name ? "center" : "end" }}
      >
        <Button
          size="sm"
          className="community-card_btn"
          onClick={navigateRoute}
        >
          View Details
        </Button>
      </div>
    </article>
  );
}

export default RecipeCard;
