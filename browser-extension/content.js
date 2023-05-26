// Respond to a request for the DOM 
chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        if (request.type == "get_dom") { 
            console.log('getting dom')
            sendResponse({ 
                payload: document.all[0].outerHTML
            });
        } else { 
            console.log('unknown request', request);
        }
    }
);


setInterval(function() { 
    chrome.runtime.sendMessage({ type: "heartbeat"})
}, 1000);
