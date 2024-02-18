const restoreBtn = document.getElementById("restoreBtn")
const clearBtn = document.getElementById("clearBtn")

//restores all tabs marked pre-crash
restoreBtn.addEventListener("click", async () => {
    chrome.storage.local.get().then(async savedTabs => {
        console.log(savedTabs);
        const openedWindows = {};
        for (const tab in savedTabs) {
            if (savedTabs[tab].isPreCrash) {
                await chrome.storage.local.remove(tab);
                const windowId = savedTabs[tab].windowId;
                const tabUrl = savedTabs[tab].url;
                if (Object.hasOwn(openedWindows, windowId)) {
                    await chrome.tabs.create({ url: tabUrl, windowId: openedWindows[windowId] });
                }
                else {
                    await chrome.windows.create({ incognito: true, url: tabUrl }).then(window => {
                        openedWindows[windowId] = window.id;
                    })
                }
            }
        }
    })
});

//clears stored data
clearBtn.addEventListener("click", () => {
    chrome.storage.local.get().then(savedTabs => {
        for (const tab in savedTabs) {
            if (savedTabs[tab].isPreCrash) {
                chrome.storage.local.remove(tab)
            }
        }
    })
});
