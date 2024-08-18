document.addEventListener("DOMContentLoaded", function () {
  const fetchContentButton = document.getElementById("fetchContent");
  console.log("Popup script loaded, adding event listener to button");


  if (fetchContentButton) {
    fetchContentButton.addEventListener("click", () => {
      console.log("Fetch Content button clicked");
  
      showSpinner();
  
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: getInnerText,
          },
          async (results) => {
            const text = results[0].result;
  
            try {
              const response = await fetch('https://localhost:3000/getNutritionData', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
              });
  
              const data = await response.json();
  
              const { calories, protein, fat, carbs } = data;
  
              document.getElementById("content").innerText = 
              `Calories: ${calories} kcal\n` +
              `Protein: ${protein} g\n` +
              `Fat: ${fat} g\n` +
              `Carbs: ${carbs} g`;
  
              hideSpinner();
            } catch (error) {
              console.error("Error:", error);
              hideSpinner();
            }
          }
        );
      });
    });
  } else {
    console.error("Fetch Content button not found");
  }
  
  function getInnerText() {
    return document.body.innerText;
  }
  
  function showSpinner() {
    console.log('show spinner called');
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('initial-content').style.display = 'none';
  }
  
  function hideSpinner() {
    console.log('hide spinner called');
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('initial-content').style.display = 'block';
  }
});

//   if (fetchContentButton) {
//     fetchContentButton.addEventListener("click", () => {
//       console.log(
//         "Fetch Content button clicked"
//       );

//       showSpinner();

//       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.scripting.executeScript(
//           {
//             target: { tabId: tabs[0].id },
//             function: getNutritionData,
//           },
//           (results) => {
//             const {calories, protein, fat, carbs} = results[0].result;

//             document.getElementById("content").innerText = 
//             `Calories: ${calories} kcal\n` +
//             `Protein: ${protein} g\n` +
//             `Fat: ${fat} g\n` +
//             `Carbs: ${carbs} g`;

//             hideSpinner();
//           }
//         );
//       });
//     });
//   } else {
//     console.error("Fetch Content button not found");
//   }
// });


// function showSpinner(){
//   console.log('show spinner called');
//   document.getElementById('loading-spinner').style.display = 'block';
//   document.getElementById('initial-content').style.display = 'none';
// }

// function hideSpinner(){
//   console.log('hide spinner called');
//   document.getElementById('loading-spinner').style.display = 'none';
//   document.getElementById('initial-content').style.display = 'block';
// }

// function getNutritionData() {


//   function getInnerText() {
//     return document.body.innerText;
//   }

//   async function callChatGPTAPI() {
//     const apiKey = "";

//     try {
//       const response = await fetch(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${apiKey}`,
//           },
//           body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [
//               {
//                 role: "user",
//                 content:
//                   getInnerText() +
//                   "Can you list the ingredients with the quantities for me and only print the answer? Extract the Items, Encapsulate Each Item in Quotes: Surround each item with double quotes. This denotes each item as a string. Separate Items with Commas: Place a comma between each item to separate them within the list. Enclose in Square Brackets: Place the entire list of items inside square brackets to define it as an array.",
//               },
//             ],
//           }),
//         }
//       );
//       const data = await response.json();
//       const gptResponse = data.choices[0].message.content;
//       return gptResponse;
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }

//   async function callEdamamAPI() {
//     const response = await callChatGPTAPI();
//     const response_1 = await fetch(
//       "https://api.edamam.com/api/nutrition-details?app_id=8615884d&app_key=9e6850cac901bd2839e90c5a9bc41103",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ingr: JSON.parse(response), 
//         }),
//       }
//     );
//     // return response
//     const data = await response_1.json();

//     const calories = data.totalNutrients.ENERC_KCAL.quantity.toFixed(2);
//     const protein = data.totalNutrients.PROCNT.quantity.toFixed(2);
//     const fat = data.totalNutrients.FAT.quantity.toFixed(2);
//     const carbs = data.totalNutrients.CHOCDF.quantity.toFixed(2);


//     return{
//       calories,
//       protein,
//       fat,
//       carbs
//     }
//   }

//   return callEdamamAPI();

// }
