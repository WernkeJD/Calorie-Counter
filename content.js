(function() {
    const bodyContent = document.body.innerText;
    console.log('Body content:', bodyContent);
  
    // Send the extracted content to the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchContent') {
        const bodyContent = document.body.innerText;
        sendResponse({ content: bodyContent });
    }
  });

  
    console.log('Content script loaded and message sent');
  })();
  
  