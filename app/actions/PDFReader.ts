"use server";
import pdf from "pdf-parse";

export const PDFReader = async (formData: FormData) => {
  const file: File | null = formData.get("file") as File;

  const bytes = await file?.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const data = await pdf(buffer);

  let string = `summary this text in a short context ${data.text}`;

  return string;
};
