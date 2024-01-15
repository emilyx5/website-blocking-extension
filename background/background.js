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

  function loop(i, reason, signature, reminders, repeats) {         
    setTimeout(function() {  
      console.log(i, reason, signature, reminders, repeats);
      if(i == reminders){
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.remove(tabs[0].id);
          });
          chrome.storage.sync.set({tempAllowed: []}, function(){
              console.log(`Temporary websites cleared.`);
          }); 
          i++;
      }    
      else{
          chrome.notifications.create('notif', {
              type: 'basic',
              iconUrl: '../images/icon-32.png',
              title: 'Hi ' + signature+ ', are you still on track?',
              message: "Make sure you are still unblocking for this reason! \n" + "You wrote: " + reason
          })
          i++;
          console.log(1000*(repeats*60));
  
          if (i <= reminders+1) { 
              chrome.notifications.clear('notif')         
              loop(i, reason, signature, reminders, repeats);             
          } 
      }                     
    }, 1000*(repeats*60))
    
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === "loop") {
      
      loop(request.params.i, request.params.reason, request.params.signature, request.params.reminders, request.params.repeats);
    }
  });
