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
            function: getInnerText,
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

function getInnerText() {
  return document.body.innerText;
}
