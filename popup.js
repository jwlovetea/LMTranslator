document.getElementById('save').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
        alert('API key saved!');
    });
});

// Load saved API key
chrome.storage.sync.get('openaiApiKey', (data) => {
    if (data.openaiApiKey) {
        document.getElementById('apiKey').value = data.openaiApiKey;
    }
}); 