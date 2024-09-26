import express from 'express';
import fetch from 'node-fetch';
import pkg from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const { json } = pkg;
import url from 'url';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors'


const app = express();
app.use(json());

//Start of Extension Logic

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID
const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY

console.log(OPENAI_API_KEY)

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
                content: text + "Can you list the ingredients with the quantities for me and only print the answer? Extract the Items, Encapsulate Each Item in Quotes: Surround each item with double quotes. This denotes each item as a string. Separate Items with Commas: Place a comma between each item to separate them within the list. Enclose in Square Brackets: Place the entire list of items inside square brackets to define it as an array. Basically, return json which has each ingredient with its quanteities always use the key Ingredients with a capital I",
              },
            ],
          }),
        });
        const gptData = await gptResponse.json();
        console.log(gptData)
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

//End Extension Logic

//Strt of Cut the Crap Logic

// app.use(cors());


// app.get('/', (req, res) => {
//   const queryObject = url.parse(req.url, true).query;

//   let indexFile = fs.readFileSync('frontend/public/index.html', 'utf8');

//   if (queryObject.url) {
//       const decodedString = Buffer.from(queryObject.url, 'base64').toString('utf8');
//       indexFile = indexFile.replace('abcde', `${queryObject.url}`);
//   }

//   res.send(indexFile)

//   console.log(queryObject);
// });

app.get('/', (req, res) => {

  const source = req.headers['source']

  if (source == 'website'){
    res.send('this is from the website')
  }else{
    res.send('hello its me');
  }
});



//End of Cut the Crap Logic
    
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server.js Server running on port ${PORT}`);
});