export const maxDuration = 60;

import { revalidatePath } from "next/cache";
import Main from "./components/Main";
export default function Home() {
  revalidatePath("/");

  return (
    <div className="w-full  rounded-xl h-screen mx-auto">
      <Main />
    </div>
  );
}
