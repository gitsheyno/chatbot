"use server";

export const sendMessage = async (prevState: any, formData: FormData) => {
  console.log("form data", formData);
  const text = formData.get("text");
  console.log(text, "text");
  return { message: text as string };
};
