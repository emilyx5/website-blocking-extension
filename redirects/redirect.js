document.addEventListener('DOMContentLoaded', function()
{
    const closeButton = document.getElementById('closeTab');
    const checkButton = document.getElementById('necessityCheck');
    const yesButton = document.getElementById('yes');
    const proceedButton = document.getElementById('proceedToPage');
    
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
        proceedButton.onclick = function(){
            const reason = document.getElementById('reason').value;
            const hours = document.getElementById('hours').value;
            const mins = document.getElementById('mins').value;
            const reminders = document.getElementById('reminders').value;
            const signature = document.getElementById('signature').value;

            if (reason && hours && mins && reminders && signature){
                const totalMins = hours*60 + mins*1;
                console.log(totalMins);
                const repeats = (totalMins/(reminders*1 + 1));
                console.log(repeats);
                
                openBlockedSite(reason, signature,reminders, repeats);
            }
            else{
                alert("Please fill in all fields!")
            }
        }

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

    async function openBlockedSite(reason, signature, reminders, repeats){
        const url = await getBlockedSite();
        console.log('Stored Tab URL:', url);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.update(tabs[0].id, { url: url });
            chrome.runtime.sendMessage({ command: "loop" , params:{
                i : 0,
                reason : reason,
                signature : signature,
                reminders : reminders,
                repeats : repeats
            }
            });
        });
        
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






