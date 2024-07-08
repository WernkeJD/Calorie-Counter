(function() {
    const bodyContent = document.body.innerText;
    console.log('Body content:', bodyContent);
  
    // Send the extracted content to the background script
    chrome.runtime.sendMessage({ content: bodyContent }, function(response) {
      console.log('Response from background script:', response);
    });
  
    console.log('Content script loaded and message sent');
  })();
  
  