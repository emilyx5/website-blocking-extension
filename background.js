chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ blockedSites: [] }, function () {
      console.log('Blocked sites initialized.');
    });
  });
  
  chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    chrome.storage.sync.get(['blockedSites'], function (result) {
      const blockedSites = result.blockedSites || [];
      const url = new URL(details.url);
      chrome.tabs.get(details.tabId, function (tab) {
        const tabUrl = new URL(tab.url);
        if (blockedSites.includes(tabUrl.hostname)) {
          chrome.tabs.update(details.tabId, { url: 'redirect.html' });
        }
      });
    });
  });
  