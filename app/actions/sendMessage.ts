"use server";
import { PDFReader } from "./PDFReader";
import { insertIntoHistory,fetchHistory } from "../seed/seedDB";
import { revalidatePath } from "next/cache";
interface Message {
  type: string;
  content: string;
}

export const sendMessage = async (formData: FormData) => {
  const data = formData.get("text") as string;
  const type = formData.get("type") as string;
  const pdf = formData.get("file") as File;

  let content : string | Message[] = "" ;

  if (pdf.size > 0 && data.length > 0) {
    content = `${data} ${await PDFReader(formData)}`;
    await insertIntoHistory(type, content)
  } else if (pdf.size > 0) {
    content = await PDFReader(formData);
    await insertIntoHistory(type, content)
  } else if (data) {
   content  = await insertIntoHistory(type, data);
  
  }



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
    await insertIntoHistory("ai", result.result);

    revalidatePath("/");

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
