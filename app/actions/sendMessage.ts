"use server";
import { PDFReader } from "./PDFReader";
import {insertIntoHistory } from "../seed/seedDB"
import { revalidatePath } from "next/cache";

export const sendMessage = async (formData: FormData) => {
  const data = formData.get("text") as string;
  const type = formData.get("type") as string;
  const pdf = formData.get("file") as File;

  let content = "";

  console.log(pdf.size > 0, "pdf name");

  if (pdf.size > 0 && data.length > 0) {
    content = `${data} ${await PDFReader(formData)}`;
  } else if (pdf.size > 0) {
    content = await PDFReader(formData);
  } else if (data) {
    content = data;
  }
  // Insert the initial message into history
  await insertIntoHistory(type, content);

  const url = "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": process.env.X_RAPIDAPI_KEY as string,
      "x-rapidapi-host": process.env.X_RAPIDAPI_HOST as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      system_prompt: "",
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

 // Insert the AI response into history
 await insertIntoHistory('ai', result.result);
    console.log("send req")

  revalidatePath('/');

    return result.result;
  } catch (error: any) {
    console.error("Error during API request:", {
      message: error.message,
      stack: error.stack,
      options,
    });
    throw error;
  }

};
