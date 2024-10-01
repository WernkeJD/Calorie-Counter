import { postChatGPTAPI } from "./shared.js";

async function cutTheCrapGetURL(queryUrl) {
    let response = await fetch(queryUrl).then((response) => response.text());

    response = response.replace(/\n/g, "");
    response = response.replace(/<script.*?<\/script>/g, "");
    response = response.replace(/<style.*?<\/style>/g, "");
    response = response.replace(/<.*?>/g, "");

    return response;
}

async function cutTheCrapPostChatGPTAPI(text) {
  return await postChatGPTAPI(
    text,
    `Can you give me a step by step instruction where each step has the ingredients within with a title for each step (1. Stir the dry ingredients: Mix 1 ½ cups all-purpose flour, 3 ½ teaspoons baking powder, 1 tablespoon white sugar, and ¼ teaspoon salt in a large bowl.)? pretend that I am a novice chef and need each step explained in detail and make the response only the answer`
  );
}

function cutTheCrapParseData(input_text) {
    input_text = input_text.replace(/\n/g, "");
    input_text = input_text.replace(/•/g, "");
    input_text += "1.";

    console.log(input_text);

    const stepsRegex = /(\d+\..+?):/g;
    let titles = [];
    let match;
    while ((match = stepsRegex.exec(input_text)) !== null) {
        titles.push(match[1].trim());
    }

    const instructionsRegex = /\d\..+?:(.+?)(?=\d\.)/g;
    let instructions = [];
    while ((match = instructionsRegex.exec(input_text)) !== null) {
        instructions.push(match[1].trim());
    }

    let output = [];
    for (let i = 0; i < titles.length; i++) {
        output.push({
            title: titles[i],
            instruction: instructions[i]
        });
    }

    return output;
}

export { cutTheCrapGetURL, cutTheCrapPostChatGPTAPI, cutTheCrapParseData };
