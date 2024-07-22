import React from "react";
import Content from "./Content";
import Side from "./Side";
import { Suspense } from "react";
export default function Main() {
  return (
    <div className=" h-full flex">
      <Side />
      <Suspense fallback={<>Loading ...</>}>
        <Content />
      </Suspense>
    </div>
  );
}
