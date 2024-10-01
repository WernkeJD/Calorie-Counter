import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI();

async function postChatGPTAPI(text, textAddition) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${text}\n${textAddition}`,
      },
    ],
  });

  return completion.choices[0].message.content;
}

export { postChatGPTAPI };
