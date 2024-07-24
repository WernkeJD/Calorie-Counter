document.addEventListener('DOMContentLoaded', function() {
    const fetchContentButton = document.getElementById('fetchContent');
    console.log('Popup script loaded, adding event listener to button');

    if (fetchContentButton) {
        fetchContentButton.addEventListener('click', () => {
            console.log('Fetch Content button clicked, sending message to background script');
            chrome.runtime.sendMessage({ action: 'fetchContent' }, function(response) {
                console.log('Response from background script:', response);
            });
        });
    } else {
        console.error('Fetch Content button not found');
    }
});


