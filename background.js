//marks all stored tabs as pre-crash
chrome.runtime.onStartup.addListener(() => {
    console.log("started up");
    chrome.storage.local.get().then(async savedTabs => {
        for (const tab in savedTabs) {
            savedTabs[tab].isPreCrash = true;
            await chrome.storage.local.remove(tab);
        };
        await chrome.storage.local.set(savedTabs);
        console.log(savedTabs)
    })
})

//adds the new tab's data to storage
chrome.tabs.onCreated.addListener(tab => {
    if (tab.incognito) {
        tabInfo = { windowId: tab.windowId, url: tab.url, isPreCrash: false }
        newtab = Object.fromEntries([[tab.id, tabInfo]])
        chrome.storage.local.set(newtab).then(() => { console.log("tab created") })
    }
});

//changes a stored tab's url to the new url
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.incognito && changeInfo.url) {
        chrome.storage.local.get(tabId.toString()).then(tabInfo => {
            tabInfo[tabId].url = changeInfo.url;
            changedTab = Object.fromEntries([[tabId, tabInfo[tabId]]]);
            chrome.storage.local.set(changedTab).then(() => { console.log("url updated") })
        })
    }
});

//removes a stored tab from storage
chrome.tabs.onRemoved.addListener(tabId => {
    chrome.storage.local.remove(tabId.toString()).then(() => { console.log("tab removed") })
});

//changes a stored tab's windowId
chrome.tabs.onAttached.addListener((tabId, attachInfo) => {
    chrome.storage.local.get(tabId.toString()).then(tabInfo => {
        tabInfo[tabId].windowId = attachInfo.newWindowId
        changedTab = Object.fromEntries([[tabId, tabInfo[tabId]]])
        chrome.storage.local.set(changedTab).then(() => { console.log("tab moved to window") })
    })
});