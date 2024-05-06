"use client";
import Image from "next/image";
import Link from "next/link";

import { Recipe, SingleRecipe } from "@/lib/interfaces";
import AddtoFavorites from "@/public/assets/favorites-star-svgrepo-com";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { Rating } from "@smastrom/react-rating";
import { useParams } from "next/navigation";
import "./styles.css";
import "@smastrom/react-rating/style.css";

import { useEffect, useState } from "react";
import { toggleFromFavorites } from "@/lib/actions/user.actions";
import { Separator } from "@/components/ui/separator";
import {
  getRequestRecipe,
  createDishRecord,
  fetchDishRatings,
  editDishRecord,
} from "@/lib/actions/recipes.action";
import { apiUrls } from "@/lib/apiUrls";
import { capitalizeFirstLetterOfWords, getRandomColor } from "@/lib/utils";
import { Loader } from "lucide-react";

function SingleRecipeDetail({ searchParams }) {
  const recipeData: SingleRecipe = useSelector(
    (state: RootState) => state.data.recipeData
  );

  const [allRecipeData, setAllRecipeData] = useState({});
  const params = useParams();
  console.log(searchParams?.isFavorite, searchParams);
  const [favorite, setfavorite] = useState(
    searchParams?.isFavorite === "false" ? false : true
  );
  const handleAddToFavorites = async () => {
    const response = await toggleFromFavorites(
      searchParams.current,
      allRecipeData.id || ""
    );
    console.log(response);
    setfavorite(!favorite);
  };

  console.log(favorite, "favo");
  const [currentRating, setCurrentRating] = useState({});

  const handleRating = async (rating) => {
    let data;
    if (currentRating?._id) {
      data = await editDishRecord(searchParams.current, rating, params.id);
    } else {
      data = await createDishRecord(searchParams.current, rating, params.id);
      setDisableRating(true);
    }

    setCurrentRating(data);
  };
  const [loading, setLoading] = useState(true);

  const getRecipesData = async () => {
    const url = `${process.env.NEXT_PUBLIC_SPOONACULAR_URL}/recipes/${params.id}/information?includeNutrition=true&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`;
    const response = await getRequestRecipe(url);

    setAllRecipeData(response.data);
    setLoading(false);
  };
  const [allRatingData, setAllRatingData] = useState([]);
  const [disableRating, setDisableRating] = useState(false);
  const getAllRatings = async () => {
    const allRecipRatings = await fetchDishRatings(params.id);

    allRecipRatings.forEach((rating) => {
      if (
        rating.userId._id === searchParams.current &&
        rating.id === params.id
      ) {
        setCurrentRating(rating);
        setDisableRating(true);
      }
    });
    setAllRatingData(allRecipRatings);
  };
  useEffect(() => {
    setLoading(true);
    getRecipesData();
    getAllRatings();
  }, []);
  console.log(favorite ? "yellow" : "#fff");
  console.log(favorite, "favori");

  return (
    <article className="community-card w-full">
      {loading ? (
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
      ) : (
        <>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="flex w-full  items-center"
                style={{ justifyContent: "space-around" }}
              >
                <Image
                  src={allRecipeData?.image}
                  alt="community_logo"
                  className="rounded-full object-cover"
                  height={300}
                  width={300}
                />

                <div>
                  <h4
                    className="text-base-semibold text-light-1"
                    style={{ fontSize: "28px" }}
                  >
                    {allRecipeData.title}
                  </h4>
                </div>
              </div>
            </div>
            <div
              className="cursor-pointer flex"
              style={{ justifyContent: "end" }}
              onClick={handleAddToFavorites}
            >
              <AddtoFavorites fill={favorite ? "yellow" : "#fff"} />
            </div>

            <h2
              className="text-sm text-light-2 mt-5 head-text mb-5"
              style={{ fontSize: "24px" }}
            >
              {" "}
              Ingredients{" "}
              {allRecipeData.extendedIngredients?.length
                .toString()
                .padStart(2, "0") || ""}
            </h2>

            <div className="grid-container">
              {allRecipeData.extendedIngredients?.map((ingredient, index) => {
                return (
                  <div
                    className="grid-item flex "
                    style={{ flexDirection: "column", alignItems: "center" }}
                    key={index}
                  >
                    <Image
                      src={`https://img.spoonacular.com/ingredients_100x100/${ingredient.image}`}
                      alt="community_logo"
                      className=" object-cover mx-auto mb-4"
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
                );
              })}
            </div>

            <h1 className="text-light-1 head-text mt-5 mb-5">
              Nutrition Digest
            </h1>

            <div>
              {allRecipeData.nutrition?.nutrients?.map((item, index) => (
                <>
                  <div className="flex justify-between w-full">
                    <p
                      className="text-light-2"
                      style={{ width: "60%", color: getRandomColor() }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-light-3"
                      style={{ width: "20%", color: getRandomColor() }}
                    >
                      {item.amount?.toFixed(0)} {item.unit}
                    </p>
                    <p
                      className="text-light-3"
                      style={{ width: "20%", color: getRandomColor() }}
                    >
                      {item.percentOfDailyNeeds?.toFixed(0)} RDI
                    </p>
                  </div>
                </>
              ))}
            </div>

            <h1 className="text-light-1 head-text mt-5 mb-5">Properties</h1>

            <div>
              {allRecipeData.nutrition?.properties?.map((item, index) => (
                <>
                  <div className="flex justify-between w-full">
                    <p
                      className="text-light-2"
                      style={{ width: "60%", color: getRandomColor() }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-light-3"
                      style={{ width: "20%", color: getRandomColor() }}
                    >
                      {item.amount?.toFixed(0)} {item.unit}
                    </p>
                  </div>
                </>
              ))}
            </div>
            <div>
              {allRecipeData.nutrition?.flavonoids?.map(
                (item, index) =>
                  item.amount > 0 && (
                    <>
                      <div className="flex justify-between w-full">
                        <p
                          className="text-light-2"
                          style={{ width: "60%", color: getRandomColor() }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-light-3"
                          style={{ width: "20%", color: getRandomColor() }}
                        >
                          {item.amount?.toFixed(2)} {item.unit}
                        </p>
                      </div>
                    </>
                  )
              )}
            </div>

            <div
              className="flex mr-10"
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <h1 className="text-light-1 head-text mt-5 mb-5">Preparation</h1>
              <p className="text-light-1 " style={{ fontSize: "16px" }}>
                {" "}
                {allRecipeData.readyInMinutes} Minutes
              </p>
            </div>

            <div>
              {allRecipeData.analyzedInstructions &&
                allRecipeData.analyzedInstructions?.length &&
                allRecipeData.analyzedInstructions[0].steps?.map(
                  (step, index) => {
                    return (
                      <div className="grid-item" key={index}>
                        <h3
                          className="text-light-1 head-text mb-5"
                          style={{ fontSize: "20px" }}
                        >
                          Step {step.number.toString().padStart(2, "0")}
                        </h3>
                        <p className="text-light-2">{step.step}</p>
                        {step.ingredients?.length > 0 && (
                          <div>
                            <h3
                              className="text-light-1 head-text mb-5 mt-5"
                              style={{ fontSize: "18px" }}
                            >
                              Ingredients Used
                            </h3>
                            <div className="grid-container">
                              {step.ingredients?.map((ingredient, index) => {
                                return (
                                  <div
                                    className="grid-item flex "
                                    style={{
                                      flexDirection: "column",
                                      alignItems: "center",
                                    }}
                                    key={index}
                                  >
                                    <Image
                                      src={ingredient.image}
                                      alt="community_logo"
                                      className=" object-cover mx-auto mb-4"
                                      height={100}
                                      width={100}
                                      style={{
                                        maxHeight: "120px",
                                        maxWidth: "120px",
                                      }}
                                    />
                                    <h6
                                      className="text-base-semibold text-light-1"
                                      style={{
                                        textAlign: "center",
                                        fontSize: "20px",
                                      }}
                                    >
                                      {capitalizeFirstLetterOfWords(
                                        ingredient.name
                                      )}
                                    </h6>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {step.equipment?.length > 0 && (
                          <div>
                            <h3
                              className="text-light-1 head-text mb-5 mt-5"
                              style={{ fontSize: "18px" }}
                            >
                              Equipment Used
                            </h3>
                            <div className="grid-container">
                              {step.equipment?.map((equipment, index) => {
                                return (
                                  <div
                                    className="grid-item flex "
                                    style={{
                                      flexDirection: "column",
                                      alignItems: "center",
                                    }}
                                    key={index}
                                  >
                                    <Image
                                      src={equipment.image}
                                      alt="community_logo"
                                      className=" object-cover mx-auto mb-4"
                                      height={100}
                                      width={100}
                                      style={{
                                        maxHeight: "120px",
                                        maxWidth: "120px",
                                      }}
                                    />
                                    <h6
                                      className="text-base-semibold text-light-1"
                                      style={{
                                        textAlign: "center",
                                        fontSize: "20px",
                                      }}
                                    >
                                      {capitalizeFirstLetterOfWords(
                                        equipment.name
                                      )}
                                    </h6>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
            </div>

            <Separator className="my-4" />
          </div>
          {!disableRating && (
            <>
              <h1 className="text-light-1 mt-5 " style={{ fontSize: "20px" }}>
                Rate the Recipe here
              </h1>
              <Rating
                style={{ maxWidth: 180 }}
                value={currentRating?.rating || 0}
                onChange={handleRating}
                className="mt-2 mb-5"
              />

              <Separator className="my-4" />
            </>
          )}
          {disableRating && (
            <>
              <h1 className="text-light-1 mt-5 " style={{ fontSize: "20px" }}>
                Your Review
              </h1>
              <Rating
                style={{ maxWidth: 180 }}
                value={currentRating?.rating || 0}
                onChange={handleRating}
                className="mt-2 mb-5"
              />

              <Separator className="my-4" />
            </>
          )}

          {allRatingData.length > 0 && (
            <h1 className="text-light-1 head-text mt-5 mb-5">
              Other User Ratings{" "}
            </h1>
          )}

          {allRatingData.length > 0 ? (
            allRatingData.map(
              (rating, index) =>
                rating.userId._id !== searchParams.current &&
                rating.id !== params.id && (
                  <div
                    className="flex justify-between w-full"
                    key={index}
                    style={{ alignItems: "center" }}
                  >
                    <div className="flex gap-5">
                      <Image
                        src={rating?.userId?.image}
                        alt="community_logo"
                        className=" object-cover mx-auto mb-4"
                        height={100}
                        width={100}
                        style={{
                          maxHeight: "120px",
                          maxWidth: "120px",
                        }}
                      />
                      <h2
                        className="text-light-1 my-5"
                        style={{ fontSize: "30px" }}
                      >
                        {rating?.userId?.name}
                      </h2>
                    </div>
                    <Rating
                      value={rating?.rating}
                      readOnly
                      style={{ maxWidth: 180 }}
                    />
                  </div>
                )
            )
          ) : (
            <div className="flex  w-full" style={{ alignItems: "center" }}>
              <h1 className="text-light-1 head-text mt-5 mb-5">
                No Ratings Yet
              </h1>
            </div>
          )}
        </>
      )}
      {allRatingData.length === 1 &&
        allRatingData[0].userId._id === searchParams.current &&
        allRatingData[0].id === params.id && (
          <h1
            className="text-light-1 head-text mt-5 mb-5"
            style={{ fontSize: "16px" }}
          >
            No Ratings Yet
          </h1>
        )}
    </article>
  );
}

export default SingleRecipeDetail;
