import { postChatGPTAPI } from "./shared.js";
import { z } from "zod";

async function cutTheCrapPostChatGPTAPI(queryUrl) {
  const RecipeSteps = z.object({
    steps: z.array(
      z.object({
        title: z.string(),
        instruction: z.string(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            quantity: z.string(),
          })
        ),
      })
    ),
  });

  return await postChatGPTAPI(
    RecipeSteps,
    "Extract the recipe information into detailed steps.",
    queryUrl
  );
}

export { cutTheCrapPostChatGPTAPI };
