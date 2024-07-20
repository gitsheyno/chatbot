"use client";
import { sendMessage } from "../actions/sendMessage";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import TypingEffect from "./TypingEffect";
import { useRef } from "react";
import SubmitButton from "./SubmitButton";

export default function Content() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(sendMessage, { message: "" });

  const handleSubmit = (formData: FormData) => {
    formAction(formData);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  console.log(state.message, "text test");
  return (
    <div className="flex-1 flex  flex-col items-center justify-between rounded-lg p-3 gap-3 bg-white">
      <div className="flex-1  w-full px-4 rounded-md overflow-y-scroll">
        <div className="max-w-2xl mx-auto ">
          {state?.message ? (
            <div>
              <TypingEffect text={state?.message} />
            </div>
          ) : null}
        </div>
      </div>
      <div className=" h-16 w-full ">
        <form
          action={handleSubmit}
          className="max-w-2xl mx-auto rounded-2xl flex items-center justify-between  px-4 bg-gray-200 "
        >
          <input
            className="w-full bg-gray-200  rounded-2xl px-2 py-4  text-sm outline-0"
            ref={inputRef}
            name="text"
            type="text"
            placeholder="Message Chatbot"
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
