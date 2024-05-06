"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { allIngredients } from "@/constants";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import page from "@/app/(root)/activity/page";
import { Input } from "../ui/input";

interface Props {
  routeType: string;
  placeholder: string;
  count: number;
}

interface Ingredient {
  label: string;
  value: string;
}

function SingleRecipeSearch({ routeType, placeholder, count }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // / query after 0.3s of no input
  const handleSearch = () => {
    const delayDebounceFn = setTimeout(() => {
      if (search.length > 0) {
        router.push(`/search/RecipeName?q=${encodeURIComponent(search)}`);
      } else {
        router.push(`/search/RecipeName`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  };

  return (
    <>
      <div className="searchbar">
        <Image
          src="/assets/search-gray.svg"
          alt="search"
          width={24}
          height={24}
          className="object-contain"
        />
        <Input
          id="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search Recipe by Name`}
          className="no-focus searchbar_input"
        />
        <Button
          size="sm"
          className="community-card_btn"
          onClick={() => {
            handleSearch();
          }}
        >
          Search
        </Button>
      </div>
    </>
  );
}

export default SingleRecipeSearch;
