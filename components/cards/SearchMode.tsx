"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
interface Props {
  label: string;
  mode: string;
}
const SearchMode = ({ label, mode }: Props) => {
  const router = useRouter();
  return (
    <button
      className="user-card_btn w-36"
      onClick={() => router.push(`/search/${mode}`)}
      style={{ width: "50%", height: "50%" }}
    >
      {label}
    </button>
  );
};

export default SearchMode;
