import Content from "./Content";
import { fetchHistory } from "../seed/seedDB";
import React from "react";

const data = await fetchHistory();

export default function Main() {
  return (
    <div className=" h-full flex">
        <Content ctx={data} />
    </div>
  );
}
