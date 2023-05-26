import {Socket} from 'phoenix'

/* Connect to Socket */
let socket = new Socket("ws://localhost:4000/socket")
socket.connect()
console.log('Connected')

let channel = socket.channel("room:lobby", {})
channel.join()
.receive("ok", resp => {
    chrome.tabs.query({}, function(tabs) { 
        channel.push("tab:list", {tabs})
    })
})
.receive("error", resp => { console.log("Unable to join", resp) })

// WINDOWS
chrome.windows.onCreated.addListener(function(w) {
    channel.push("window:created", {"window": w})
});

chrome.windows.onRemoved.addListener(function(windowId) {
    channel.push("window:removed", {windowId})
});


// TABS
chrome.tabs.onCreated.addListener(function(tab) {
    channel.push("tab:created", {tab})
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    channel.push("tab:updated", {tab})
});

chrome.tabs.onRemoved.addListener(function(tabId) {
    channel.push("tab:removed", {tabId})
});

// ACTIONS
channel.on("windows:create", ({url}) => {
    console.log(`creating a new window and visiting ${url}`)
    chrome.windows.create({url});
})

channel.on("windows:remove", ({window_id}) => {
    console.log(`closing window_id ${window_id}`)
    chrome.windows.remove(window_id);
})

channel.on("tabs:reload", ({tab_id}) => {
    console.log(`reloading tab_id ${tab_id}`)
    chrome.tabs.reload(tab_id);
})

channel.on("tabs:save_html", ({tab_id}) => {
    chrome.tabs.sendMessage(tab_id, {type: "get_dom"}, function(response) {
        channel.push("tabs:got_html", {tab_id, payload: response.payload})
    });
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) { 
        if (request.type == "heartbeat") { 
            console.log(`got heartbeat`)
        } else { 
            console.log(`some other request ${request}`)
        }
    }
);
