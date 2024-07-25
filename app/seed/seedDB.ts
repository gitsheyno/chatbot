import { db } from "@vercel/postgres";

interface Message {
  type: string;
  content: string;
}

async function getClient() {
  const client = await db.connect();
  return client;
}

export async function insertIntoHistory(type: string, content: string) {


    console.log("content in db query func",content,type)
  const client = await getClient();
  try {
    const result = await client.sql`
      INSERT INTO history (type, content)
      VALUES (${type}, ${content})
      RETURNING id
    `;
    return fetchHistory();
  } finally {
    client.release();
  }
}

export async function fetchHistory() {
  try {
    const data = await db<Message>`SELECT * FROM history`;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}
