chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "translate") {
        try {
            const translation = await translateText(request.text, request.apiKey);
            showTranslation(translation);
        } catch (error) {
            console.error('Translation error:', error);
            alert('Translation failed. Please check your API key and try again.');
        }
    }
});

async function translateText(text, apiKey) {
    try {
        const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "You are a translator. Translate the following text to Chinese. Only provide the translation, no additional explanations."
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 1.0,
                top_p: 1.0,
                max_tokens: 1000,
                model: "gpt-4o"
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Translation error:", error);
        throw error;
    }
}

function showTranslation(translation) {
    // Remove existing translation popup if any
    const existingPopup = document.getElementById('translation-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create and style the popup
    const popup = document.createElement('div');
    popup.id = 'translation-popup';
    popup.style.cssText = `
        position: fixed;
        top: ${window.scrollY + 50}px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
        color: #ffffff;
        padding: 30px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 600px;
        max-width: 800px;
        width: 70%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 18px;
        line-height: 1.6;
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        border: none;
        background: rgba(255,255,255,0.1);
        color: #ffffff;
        cursor: pointer;
        font-size: 28px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
        &:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.1);
        }
    `;
    closeButton.onclick = () => popup.remove();

    // Add translation text container
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
        margin-top: 10px;
        padding: 20px;
        background: rgba(255,255,255,0.05);
        border-radius: 12px;
        word-wrap: break-word;
        max-height: 60vh;
        overflow-y: auto;
        font-size: 20px;
        line-height: 1.8;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
    `;
    textContainer.textContent = translation;

    // Add title
    const title = document.createElement('div');
    title.textContent = 'Translation';
    title.style.cssText = `
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 2px solid rgba(255,255,255,0.2);
        padding-bottom: 10px;
    `;

    popup.appendChild(closeButton);
    popup.appendChild(title);
    popup.appendChild(textContainer);
    document.body.appendChild(popup);
} 