"use client";
import React, { useState } from "react";
import RecipeCard from "./RecipeCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import "./styles.css";
import NameRecipeCard from "./NameRecipeCard";
const RecipeContainer: React.FC<{
  dishesData: any[];
  nameMode: boolean;
  user: string;
}> = ({ dishesData, nameMode, user }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the indexes for displaying items on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, dishesData.length);

  // Slice the dishesData array to display only items for the current page
  const currentDishesData = dishesData.slice(startIndex, endIndex);

  // Handle pagination
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(dishesData.length / itemsPerPage))
    );
  };
  console.log(currentDishesData, "currentDishesData");

  return (
    <>
      <div>
        <p className="head-text mb-10">
          {dishesData.length > 0
            ? `Dishes List (${startIndex + 1} - ${endIndex})`
            : dishesData.length === 0
            ? "No dishes found"
            : "Please enter ingredients to search"}
        </p>
        {currentDishesData.map((dish: any, index: number) => (
          <div className="my-5">
            <RecipeCard key={index} dish={dish} name={nameMode} userId={user} />
            {/* <NameRecipeCard key={index} dish={dish} /> */}
          </div>
        ))}
      </div>

      <Pagination className="recipePage">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handlePreviousPage} />
          </PaginationItem>
          {[...Array(Math.ceil(dishesData.length / itemsPerPage))].map(
            (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext onClick={handleNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default RecipeContainer;
