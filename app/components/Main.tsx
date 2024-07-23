import React from "react";
import Content from "./Content";
import Side from "./Side";
import { Suspense } from "react";


import {fetchHistory} from "../seed/seedDB"

const x = await fetchHistory()

export default function Main() {
  return (
    <div className=" h-full flex">
      <Side />
      <Suspense fallback={<>Loading ...</>}>
        <Content ctx = {x} />
      </Suspense>
    </div>
  );
}
