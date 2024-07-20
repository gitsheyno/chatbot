"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="hover:text-white hover:scale-[1.5]  transition-all"
      disabled={pending}
    >
      {pending ? <>🛑</> : <>↑</>}
    </button>
  );
}
