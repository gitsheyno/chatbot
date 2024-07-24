import Content from "./Content";
import { fetchHistory } from "../seed/seedDB";

const data = await fetchHistory();

export default function Main() {
  return (
    <div className=" h-full flex">
        <Content ctx={data} />
    </div>
  );
}
