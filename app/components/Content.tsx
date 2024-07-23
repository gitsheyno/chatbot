"use client";

import { sendMessage } from "../actions/sendMessage";
import { useFormStatus } from "react-dom";
import TypingEffect from "./TypingEffect";
import { useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
export const maxDuration = 60;

interface Message {
  type: string;
  text: string;
}

type M = string;

export default function Content() {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefFile = useRef<HTMLInputElement>(null);
  const { pending } = useFormStatus();
  const [history, setHistory] = useState<M[]>([]);
  const [file, setFile] = useState<File>();
  const [url, setURL] = useState<string>();
  const [test, setTest] = useState<Message[]>([]);

  const handleSubmit = async (formData: FormData) => {
    const data = formData.get("text") as string;
    const pdf = formData.get("file") as File;

    const f: Message = {
      type: "file",
      text: url as string,
    };

    if (pdf.name.length) {
      const f: Message = {
        type: "file",
        text: url as string,
      };
      setTest((prev) => [...prev, f]);
      formData.append("type", f.type);

    } else if (data) {
      
      const d: Message = {
        type: "user",
        text: data,
      };
      formData.append("type", d.type);

      setTest((prev) => [...prev, d]);
    }

    const answer = await sendMessage(formData);

    const a: Message = {
      type: "ai",
      text: answer,
    };
    setTest((prev) => [...prev, a]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (inputRefFile.current) {
      inputRefFile.current.value = "";
    }
  };

  const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Get the first selected file

    setFile(selectedFile);

    if (url) {
      URL.revokeObjectURL(url);
    }

    if (selectedFile) {
      const newUrl = URL.createObjectURL(selectedFile);
      setURL(newUrl);
    } else {
      setURL(undefined);
    }
  };
  return (
    <div className="flex-1 flex  flex-col items-center justify-between rounded-lg p-3 gap-3 bg-white">
      <div className="flex-1  w-full px-4 rounded-md overflow-y-scroll">
        <div className="max-w-2xl mx-auto ">
          <>
            <div>
              {test.map((item, index) => {
                const { type, text } = item;

                console.log(type);
                if (type === "file") {
                  return (
                    <iframe
                      key={index}
                      src={text}
                      width="100"
                      height="200"
                      title="PDF Viewer"
                    ></iframe>
                  );
                } else if (type === "user") {
                  return (
                    <div
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-yellow-200"
                          : "bg-gray-700 text-white"
                      } p-4 rounded-md mb-2 text-sm`}
                    >
                      <TypingEffect text={text} />
                      {/* {text} */}
                    </div>
                  );
                } else if (type === "ai") {
                  return (
                    <div
                      key={index}
                      className={`${"bg-gray-700 text-white"} p-4 rounded-md mb-2 text-sm`}
                    >
                      <TypingEffect text={text} />
                    </div>
                  );
                }
              })}
            </div>
          </>
        </div>
      </div>
      <div className=" h-16 w-full ">
        <form
          action={handleSubmit}
          className="max-w-2xl relative mx-auto rounded-2xl flex items-center justify-between  px-4 bg-gray-200 "
        >
          <label htmlFor="input" className="hover:cursor-pointer">
            🗂️
          </label>

          <input
            className="w-full bg-gray-200   rounded-2xl px-2 py-4  text-sm outline-0"
            ref={inputRef}
            name="text"
            type="text"
            placeholder="Message Chatbot"
          />
          <input
            style={{ display: "none" }}
            ref={inputRefFile}
            id="input"
            name="file"
            type="file"
            onChange={handler}
            accept="application/pdf"
          />
          {/* {url && file && (
            <iframe
              className="absolute  bottom-full left-1"
              src={url}
              width="100"
              height="100"
              title="PDF Viewer"
            ></iframe>
          )} */}
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
