console.log('Content script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in content script:', message);

    if (message.action === 'fetchContent') {
        console.log('Fetch content action received in content script');
        const bodyContent = document.body.innerText;
        console.log('Sending body content:', bodyContent);
        sendResponse({ content: bodyContent });
    }
});
  