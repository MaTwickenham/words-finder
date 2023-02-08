chrome.runtime.onInstalled.addListener((tableId, changeInfo, tab) => {
    chrome.contextMenus.create({
        id: 'addWords',
        title: "Send \"%s\" to background",
        contexts: ['all']
    })
});

async function getMeaning(word) {
    let response = await fetch('https://cn.bing.com/dict/search?q=' + word)
    let data = await response.text()
    return data
}

function getSelection(info, tab) {
    if (info.menuItemId === "addWords") {
        chrome.tabs.sendMessage(tab.id, { action: "getSelection" }, async (response) => {
            let html = await getMeaning(response.word)
            let pos = response.pos;
            chrome.tabs.sendMessage(tab.id, {action: "translation", data: html, pos: pos}, response => {
                console.log("sended!")
            })
        });
    }
}

chrome.contextMenus.onClicked.addListener(getSelection);