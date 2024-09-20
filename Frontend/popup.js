
document.addEventListener("DOMContentLoaded", function () {
  const fetchContentButton = document.getElementById("fetchContent");
  const fetchCrap = document.getElementById("fetchCrap");
  // const serving_size_1_button = document.getElementByid("1serving");
  // const serving_size_2_button = document.getElementByid("2serving");
  // const serving_size_3_button = document.getElementByid("3serving");
  // const serving_size_4_button = document.getElementByid("4serving");
  console.log("Popup script loaded, adding event listener to all buttons");


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
              const response = await fetch('https://calorie-counter-k4kc.onrender.com/getNutritionData', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text }),
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

  // function updateServing() {
  //   serving_size_1_button.addEventListener("click", () => {
  //     console.log(document.getElementById("contnet").innerText)
  //   })

  // }
  
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

  function base64Encode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
  }


  if (fetchCrap) {
    fetchCrap.addEventListener("click", () => {
      console.log("Fetch crap clicked");
  
      showSpinner();
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const pageUrl = tabs[0].url; 
        const newUrl = "https://vl7w7gh4-3000.use.devtunnels.ms/";
  
        chrome.tabs.create({ url: `${newUrl}?url=${encodeURIComponent(pageUrl)}` });
  
        hideSpinner();
      });
    });
  }
});
