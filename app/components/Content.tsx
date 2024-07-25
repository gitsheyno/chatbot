"use client";

import { sendMessage } from "../actions/sendMessage";
import TypingEffect from "./TypingEffect";
import { useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
import React from "react";


interface Message {
  type: string;
  content: string;
}

export default function Content({ctx} : {ctx : Message[]}) {

  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefFile = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();
  const [url, setURL] = useState<string>();
  const [history, setHistory] = useState<Message[]>(ctx);
  const[error,setError] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    const data = formData.get("text") as string;
    const pdf = formData.get("file") as File;


    if(!inputRef.current?.value && !inputRefFile.current?.value){
      setError(true)
      return
    }
    else if(inputRef.current?.value || inputRefFile.current?.value){
      setError(false)
    }


    if (pdf.name.length && data.length > 0) {

      const file: Message = {
        type: "file",
        content: url as string,
      };

      const text: Message = {
        type: "user",
        content: data,
      };

      setHistory((prev) => [...prev, file, text]);
      formData.append("type", file.type);

    } else if (pdf.name.length) {
      const file: Message = {
        type: "file",
        content: url as string,
      };
      setHistory((prev) => [...prev, file]);
      formData.append("type", file.type);
    } else if (data) {
      const text: Message = {
        type: "user",
        content: data,
      };
      formData.append("type", text.type);

      setHistory((prev) => [...prev, text]);
    }

    const answer = await sendMessage(formData);

    const ai: Message = {
      type: "ai",
      content: answer,
    };
    setHistory((prev) => [...prev, ai]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (inputRefFile.current) {
      inputRefFile.current.value = "";
    }
  };



  const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; 

    // setFile(selectedFile);

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
          {history.length !== 0 ? 
          <>
            <div data-testid = "ai">
              {history.map((item, index) => {
                const { type, content } = item;

                if (type === "file") {
                  return (
                    <iframe
                      key={index}
                      src={content}
                      width="100"
                      height="200"
                      title="PDF Viewer"
                    ></iframe>
                  );
                } else if (type === "user") {
                  return (
                    <div
                      key={index}
                      className="bg-yellow-200  text-gray-700 p-4 rounded-md mb-2 text-sm"
                    >
                      <h2 className="font-bold">🤷🏼‍♂️</h2>
                      <br/>
                      <TypingEffect text={content} />
                    </div>
                  );
                } else if (type === "ai") {
                  return (
                    <div
                      key={index}
                      className={`${"bg-gray-700 text-white"} p-4 rounded-md mb-2 text-sm`}
                    >
                      <h2 className="font-bold">🤖</h2>
                      <br/>
                      <TypingEffect text={content} />
                    </div>
                  );
                }
              })}
            </div>
          </>
           : 
           <div className="w-full text-center text-gray-300  mx-auto">start you conversation by entering a prompt or uploading a file</div>
            }
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
          <SubmitButton/>
        {error ? <p className="absolute top-full left-1 text-red-700 text-sm">* input data</p> : ""}
        </form>
      </div>
    </div>
  );
}
