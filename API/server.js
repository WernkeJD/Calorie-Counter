import express from 'express';
import fetch from 'node-fetch';
import pkg from 'body-parser';
const { json } = pkg;


const app = express();
app.use(json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

const OPENAI_API_KEY = "";
const EDAMAM_APP_ID = "";
const EDAMAM_API_KEY = "";

app.post('/getNutritionData', async (req, res) => {
    const { text } = req.body

    try {
        const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            response_format: {"type": "json_object"},
            messages: [
              {
                role: "user",
                content: text + "Can you list the ingredients with the quantities for me and only print the answer? Extract the Items, Encapsulate Each Item in Quotes: Surround each item with double quotes. This denotes each item as a string. Separate Items with Commas: Place a comma between each item to separate them within the list. Enclose in Square Brackets: Place the entire list of items inside square brackets to define it as an array. Basically, return json which has each ingredient with its quanteities",
              },
            ],
          }),
        });
        const gptData = await gptResponse.json();
        console.log(text)
        // res.status(200).send(gptData);
        const ingredients = gptData.choices[0].message.content;
        console.log(ingredients);

        let ingredients_list = [];

        ingredients_list = JSON.parse(ingredients).Ingredients
      //   Object.entries(JSON.parse(ingredients)).forEach(([key, value]) => {
      //     console.log(`${key}: ${value}`);
      //     ingredients_list.push(`${key}: ${value}`);
      //     console.log(ingredients_list);
      // });
    
        const edamamResponse = await fetch(`https://api.edamam.com/api/nutrition-details?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingr: ingredients_list }),
        });
        const nutritionData = await edamamResponse.json();
    
        const calories = nutritionData.totalNutrients.ENERC_KCAL.quantity.toFixed(2);
        const protein = nutritionData.totalNutrients.PROCNT.quantity.toFixed(2);
        const fat = nutritionData.totalNutrients.FAT.quantity.toFixed(2);
        const carbs = nutritionData.totalNutrients.CHOCDF.quantity.toFixed(2);
    
        res.json({ calories, protein, fat, carbs });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send(error);
    }
});
    
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});