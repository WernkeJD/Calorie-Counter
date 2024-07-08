chrome.runtime.onInstalled.addListener(() => {
  console.log("Calorie Counter Installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchContent' && sender.tab) {
      chrome.tabs.sendMessage(sender.tab.id, { action: 'fetchContent' }, (response) => {
          if (response && response.content) {
              console.log('Received content:', response.content);
              sendResponse({ received: true, content: response.content });
          } else {
              sendResponse({ received: false });
          }
      });
      return true; // Indicates response will be sent asynchronously
  }
});
