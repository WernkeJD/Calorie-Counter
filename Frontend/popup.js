document.getElementById('fetchContent').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'fetchContent' }, function(response) {
        console.log('Response from background script:', response);
    });
});
