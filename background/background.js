chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ blockedSites: [] }, function () {
      console.log('Blocked sites initialized.');
    });
    chrome.storage.sync.set({tempAllowed: []}, function() {
      console.log('Temporary sites initialized')
    });
  });
  
  chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    chrome.storage.sync.get(['blockedSites'], function (result) {
      const blockedSites = result.blockedSites || [];
      const url = new URL(details.url);
      chrome.tabs.get(details.tabId, function (tab) {
        if(!(tab.url.includes('redirects/'))){
          const tabUrl = new URL(tab.url);
          if (blockedSites.includes(tabUrl.hostname)){
            chrome.storage.sync.get(['tempAllowed'], function(list){
                const tempAllowed = list.tempAllowed;
                if(!(tempAllowed.includes(tabUrl.hostname))){
                  chrome.tabs.update(details.tabId, { url: 'redirects/redirect.html' });
                  chrome.storage.sync.set({wantedSite: tab.url}, function () {
                    console.log('Original url is stored')
                  });
                }
            });
          }
        }
      });
    });
  });
