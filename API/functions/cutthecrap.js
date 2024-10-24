import { postChatGPTAPI } from "./shared.js";
import { z } from "zod";
import fetch from "node-fetch"; // For making GET requests
import * as cheerio from "cheerio";

function parseAllRecipesHTML($) {
  let data_template = {
    title: "",
    time: "",
    servings: "",
    steps: [],
  };

  data_template.title = $(".article-heading").first().text();

  let matchingElement = null;
  $(".mm-recipes-details__label").each((_, el) => {
    const text = $(el).text().trim();
    if (text === "Total Time:") {
      matchingElement = $(el);
    }
  });

  data_template.time = matchingElement
    .parent()
    .find(".mm-recipes-details__value")
    .text();

  matchingElement = null;
  $(".mm-recipes-details__label").each((_, el) => {
    const text = $(el).text().trim();
    if (text === "Servings:") {
      matchingElement = $(el);
    }
  });

  data_template.servings = matchingElement
    .parent()
    .find(".mm-recipes-details__value")
    .text();

  const ingredientElements = $('.mm-recipes-structured-ingredients__list-item');

  data_template.steps = ingredientElements.map((_, el) => {
    const quantity = $(el).find('span[data-ingredient-quantity="true"]').text();
    const unit = $(el).find('span[data-ingredient-unit="true"]').text();
    const name = $(el).find('span[data-ingredient-name="true"]').text();
    console.log(`${quantity} ${unit}`, name);
  });

  // data_template.steps = $(".instructions-section-item").map((_, el) => {
  //   const title = $(el).find(".section-body").text();
  //   const instruction = $(el).find(".section-body").text();
  //   const ingredients = $(el)
  //     .find(".ingredients-item")
  //     .map((i, el) => {
  //       const name = $(el).find(".ingredients-item-name").text();
  //       const quantity = $(el).find(".ingredients-item-quantity").text();
  //       return { name, quantity };
  //     })
  //     .get();
  //   return { title, instruction, ingredients };
  // });

  console.log(data_template);
  return data_template;
}

async function getAndParseHTML(url) {
  let parsedUrl = null;
  let $ = null;

  try {
    parsedUrl = new URL(url);
  } catch (error) {
    console.error("Invalid URL", error);
    return null;
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    $ = cheerio.load(html);
  } catch (error) {
    console.error("Error fetching or parsing HTML:", error);
  }

  switch (parsedUrl.hostname) {
    case "www.allrecipes.com":
      return parseAllRecipesHTML($);
    default:
      console.log("Unknown");
  }
}

console.log(
  getAndParseHTML("https://www.allrecipes.com/recipe/20513/classic-waffles/")
);

async function cutTheCrapPostChatGPTAPI(queryUrl) {
  const RecipeSteps = z.object({
    title: z.string(),
    time: z.string(),
    servings: z.string(),
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
    "Extract the recipe information into detailed steps along with information about the cooktime and serving count.",
    queryUrl
  );
}

export { cutTheCrapPostChatGPTAPI };
