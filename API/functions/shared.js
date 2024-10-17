import dotenv from "dotenv";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

dotenv.config();

const openai = new OpenAI();

async function postChatGPTAPI(object, context, content) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      { role: "system", content: context },
      {
        role: "user",
        content: content,
      },
    ],
    response_format: zodResponseFormat(object, "event"),
  });

  return completion.choices[0].message.parsed;
}

export { postChatGPTAPI };
