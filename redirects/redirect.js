document.addEventListener('DOMContentLoaded', function()
{
    const closeButton = document.getElementById('closeTab');
    const checkButton = document.getElementById('necessityCheck');
    const yesButton = document.getElementById('yes');
    const proceedButton = document.getElementById('proceedToPage')

    if(closeButton){
        closeButton.addEventListener('click', closeTab);
    }
    if(checkButton){
        checkButton.addEventListener('click', openNecessityCheck);
    }
    if(yesButton){
        yesButton.addEventListener('click', openScroll);
    }
    if(proceedButton){
        proceedButton.addEventListener('click', openBlockedSite);
    }

    function closeTab(){
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.remove(tabs[0].id);
        });
    }   
    function openNecessityCheck(){
        closeTab();
        chrome.tabs.create({ url: 'redirects/necessityCheck.html' });
    }   
    function openScroll(){
        closeTab();
        chrome.tabs.create({ url: 'redirects/scroll.html' });
    } 
    async function openBlockedSite(){
        const url = await getBlockedSite();
        console.log('Stored Tab URL:', url);
        chrome.tabs.create({url : url});
    }

    function getBlockedSite(){
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['wantedSite'], function (result) {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                const blockedSite = result.wantedSite;
                const url = new URL(blockedSite);
                if (blockedSite) {
                    chrome.storage.sync.get(['tempAllowed'], function(result){
                        const tempAllowed = result.tempAllowed || [];
                        if (!(tempAllowed.includes(url.hostname))){
                            tempAllowed.push(url.hostname)
                            chrome.storage.sync.set({tempAllowed}, function(){
                                console.log(`${url.hostname} temporarily allowed.`);
                            });
                        }
                    });
                  resolve(blockedSite);
                } else {
                  reject('No stored tab URL found.');
                }
              }
            });
        });
    }

})





