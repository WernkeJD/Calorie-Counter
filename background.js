chrome.runtime.onInstalled.addListener(() => {
  console.log("Calorie Counter Installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background script:', message);

  if (message.action === 'fetchContent') {
      // Check if the message is sent from a tab context
          console.log('Fetch content action received, sending message to content script');
          chrome.tabs.sendMessage(sender.tab.id, { action: 'fetchContent' }, (response) => {
              console.log('Response from content script:', response);
                  console.log('Received content from content script:', response.content);
                  sendResponse({ received: true, content: response.content });
          });
          return true; // Indicates response will be sent asynchronously
        }
      });