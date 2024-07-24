import Content from "./Content";
import { fetchHistory } from "../seed/seedDB";
import React from "react";

import { revalidatePath } from "next/cache";
const data = await fetchHistory();

export default function Main() {

  revalidatePath("/")
  return (
    <div className=" h-full flex">
        <Content ctx={data} />
    </div>
  );
}
