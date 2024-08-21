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
