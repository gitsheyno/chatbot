import React from "react";
import Content from "./Content";
import Side from "./Side";
export default function Main() {
  return (
    <div className=" h-full flex">
      <Side />
      <Content />
    </div>
  );
}
