chrome.runtime.onInstalled.addListener(() => {
    console.log("Calorie Counter Installed");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in background script:', message);
  
    if (message.content) {
      console.log('Received content:', message.content);
      sendResponse({ received: true });
    }
  });
  