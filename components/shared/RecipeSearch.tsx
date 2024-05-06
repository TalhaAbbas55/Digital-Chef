"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { allIngredients } from "@/constants";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import page from "@/app/(root)/activity/page";
import "./styles.css";
import { Loader } from "lucide-react";
interface Props {
  routeType: string;
  placeholder: string;
  count: number;
}

interface Ingredient {
  label: string;
  value: string;
}

function RecipeSearch({ routeType, placeholder, count }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );

  // / query after 0.3s of no input
  const handleSearch = (pagesParam: { setLoader?: boolean }) => {
    pagesParam.setLoader && setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      if (selectedIngredients.length > 0) {
        const allIngredients = selectedIngredients
          .map((ingredient) => ingredient.value)
          .join(",");
        router.push(
          `/search/IngredientsBased?q=${encodeURIComponent(allIngredients)}`
        );
      } else {
        router.push(`/search/IngredientsBased`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  };
  useEffect(() => {
    if (count > 0 || count === -1) {
      setLoading(false);
    }
  }, [count]);
  const handleIngredientChange = (newValue: Ingredient[]) => {
    setSelectedIngredients(newValue);
  };

  return (
    <>
      <div className="flex justify-between mr-2">
        <h1 className="head-text mb-10">Search by Ingredients</h1>

        {loading && <Loader size={40} className="animate-spin" color="white" />}
      </div>
      <div className="searchbar">
        {/* <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain"
        /> */}
        <CreatableSelect
          isClearable
          options={allIngredients}
          isMulti
          value={selectedIngredients}
          onChange={handleIngredientChange}
          className="ingredient_search"
          // inputValue={search}
        />

        <Button
          size="sm"
          className="community-card_btn"
          onClick={() => handleSearch({ setLoader: true })}
        >
          Search
        </Button>
      </div>
    </>
  );
}

export default RecipeSearch;
