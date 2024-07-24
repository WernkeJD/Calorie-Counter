document.addEventListener("DOMContentLoaded", function () {
  const fetchContentButton = document.getElementById("fetchContent");
  console.log("Popup script loaded, adding event listener to button");

  if (fetchContentButton) {
    fetchContentButton.addEventListener("click", () => {
      console.log(
        "Fetch Content button clicked, sending message to background script"
      );
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: getNutritionData,
          },
          (results) => {
            document.getElementById("content").innerText = results[0].result;
          }
        );
      });
    });
  } else {
    console.error("Fetch Content button not found");
  }
});

function getNutritionData() {
  function getInnerText() {
    return document.body.innerText;
  }

  async function callChatGPTAPI() {
    const apiKey = "";

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content:
                  getInnerText() +
                  "Can you list the ingredients with the quantities for me and only print the answer? Extract the Items, Encapsulate Each Item in Quotes: Surround each item with double quotes. This denotes each item as a string. Separate Items with Commas: Place a comma between each item to separate them within the list. Enclose in Square Brackets: Place the entire list of items inside square brackets to define it as an array.",
              },
            ],
          }),
        }
      );
      const data = await response.json();
      const gptResponse = data.choices[0].message.content;
      return gptResponse;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function callEdamamAPI() {
    const response = await callChatGPTAPI();
    const response_1 = await fetch(
      "https://api.edamam.com/api/nutrition-details?app_id=8615884d&app_key=9e6850cac901bd2839e90c5a9bc41103",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingr: JSON.parse(response), 
        }),
      }
    );
    // return response
    const data = await response_1.json();
    return data.totalNutrients.ENERC_KCAL.quantity;
  }

  return callEdamamAPI();
}
