// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "translateSelection",
        title: "Translate selected text",
        contexts: ["selection"]
    });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translateSelection") {
        chrome.storage.sync.get('apiKey', async (data) => {
            if (!data.apiKey) {
                alert('Please set your GitHub token first!');
                return;
            }

            try {
                // Make sure the tab exists and is ready
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tabs.length === 0) {
                    console.error('No active tab found');
                    return;
                }

                // Inject content script if not already injected
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    });
                } catch (e) {
                    // Script might already be injected, continue
                    console.log('Content script might already be injected');
                }

                // Send message to content script
                await chrome.tabs.sendMessage(tab.id, {
                    action: "translate",
                    text: info.selectionText,
                    apiKey: data.apiKey
                });
            } catch (error) {
                console.error('Error in background script:', error);
                alert('Translation failed. Please try again.');
            }
        });
    }
});

// Listen for connection errors
chrome.runtime.onConnect.addListener(function (port) {
    port.onDisconnect.addListener(function () {
        if (chrome.runtime.lastError) {
            console.log('Connection error:', chrome.runtime.lastError);
        }
    });
}); 
}); 