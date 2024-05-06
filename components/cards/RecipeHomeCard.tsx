"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { Recipe, SingleRecipe } from "@/lib/interfaces";
import AddtoFavorites from "@/public/assets/favorites-star-svgrepo-com";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setRecipeData } from "@/lib/redux/DataSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleFromFavorites } from "@/lib/actions/user.actions";
import { useId, useState } from "react";

function RecipeHomeCard({ dish, userId, isFavorite }: SingleRecipe) {
  console.log(dish);
  const router = useRouter();

  const navigateRoute = () => {
    console.log(" ia mhere", useId);
    if (!userId) {
      console.log(" ia mhereddd", userId);
      redirect("/sing-in");
      return;
    }
    router.push(
      `/search/SingleRecipe/${dish.id}?current=${userId}&isFavorite=${isFavorite}`
    );
  };

  return (
    <article
      className="community-card w-full cursor-pointer"
      style={{ minWidth: "300px" }}
      onClick={navigateRoute}
    >
      <div className="flex flex-wrap items-center gap-3 justify-center">
        <div className="flex w-full justify-between items-center">
          <div>
            <Image
              src={dish.image || ""}
              alt="community_logo"
              // fill
              className="rounded-full object-cover"
              style={{ minHeight: 250, minWidth: 250 }}
              width={250}
              height={250}
            />
          </div>
        </div>

        <div>
          <div>
            {dish.title && dish.title?.length > 20 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <h4 className="text-base-semibold text-light-1">
                      {dish.title?.substring(0, 20) + "..."}
                    </h4>
                  </TooltipTrigger>
                  <TooltipContent>{dish.title}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <h4 className="text-base-semibold text-light-1">
                {dish.title?.substring(0, 20) + "..."}
              </h4>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default RecipeHomeCard;
