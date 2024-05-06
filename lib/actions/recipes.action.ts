"use server";
import axios from "axios";

import { connectToDatabase } from "./mongoose";
import Dish from "../models/recipe.model";
import User from "../models/user.models";

export const getRequestRecipe = async (url: string) => {
  console.log(url, "here");
  try {
    const response = await axios.get(url);
    return {
      data: response.data,
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data || error?.message,
    };
  }
};

export async function createDishRecord(
  userId: string,
  rating: number,
  dishId: string
) {
  connectToDatabase();
  try {
    // Create a new record in the Dish collection
    const createdDish = await Dish.create({
      userId,
      rating,
      id: dishId,
    });

    console.log("Dish record created:", createdDish);

    // Optionally, you can return the created dish record
    return createdDish;
  } catch (error) {
    // Handle any errors that occur during creation
    throw new Error(`Failed to create dish record: ${error.message}`);
  }
}
export async function fetchDishRatings(dishId: string) {
  connectToDatabase();
  try {
    // Find all ratings that match the provided dishId
    const ratings = await Dish.find({ id: dishId });

    console.log("Dish ratings:", ratings);
    // Extract user IDs from the ratings
    const userIds = ratings.map((rating) => rating.userId);

    console.log("User IDs:", userIds);
    // Fetch user data for the extracted user IDs
    const users = await User.find({ _id: { $in: userIds } }, "name image _id");

    console.log("Users:", users);
    // Replace userIds with user objects in the ratings
    const populatedRatings = ratings.map((rating) => {
      const user = users.find((user) => user._id.toString() === rating.userId);
      return { ...rating.toObject(), userId: user }; // Replace userId with user object
    });

    console.log("Dish ratings:", populatedRatings);

    // Optionally, you can return the fetched ratings
    return populatedRatings;
  } catch (error) {
    // Handle any errors that occur during fetching
    throw new Error(`Failed to fetch dish ratings: ${error.message}`);
  }
}

export async function editDishRecord(
  userId: string,
  rating: number,
  dishId: string
) {
  connectToDatabase();
  try {
    console.log("Dish ID:", dishId);
    // Find the dish record in the Dish collection based on the dishId
    const dish = await Dish.findOneAndUpdate(
      { id: dishId, userId },
      { rating: rating },
      { new: true }
    );

    if (!dish) {
      throw new Error("Dish not found");
    }

    console.log("Dish record updated:", dish);

    // Optionally, you can return the updated dish record
    return dish;
  } catch (error) {
    // Handle any errors that occur during the update
    throw new Error(`Failed to update dish record: ${error.message}`);
  }
}
