"use client";
import React from "react";
import { Button } from "../ui/button";

const BackToTop = () => {
  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex justify-center" onClick={backToTop}>
      <Button className="user-card_btn mt-5 ">Back to Top</Button>
    </div>
  );
};

export default BackToTop;
