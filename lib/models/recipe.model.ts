import mongoose from "mongoose";
import { createDispatchHook } from "react-redux";

const recipeSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  id: { type: String, required: true },
  userId: { type: String, required: true },
});

console.log(mongoose.models, "mongoose");

const Dish = mongoose.models.Dish || mongoose.model("Dish", recipeSchema);

export default Dish;
