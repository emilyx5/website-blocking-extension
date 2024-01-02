document.addEventListener('DOMContentLoaded', function () {
    const blockButton = document.getElementById('blockButton');
    const websiteInput = document.getElementById('website');
  
    function updateBlockedList(blockedSites){
        blockedSitesList.innerHTML = '';
        if (blockedSites.length == 0){
            blockedSitesList.innerHTML = '<p>No websites blocked! </p>'
        }
        else{
            blockedSites.forEach(function (site){
                const li = document.createElement("li");
                li.textContent = site;
                blockedSitesList.appendChild(li);
            });
        }
    }
    chrome.storage.sync.get(['blockedSites'], function (result) {
        const blockedSites = result.blockedSites || [];
        updateBlockedList(blockedSites);
      });

    blockButton.addEventListener('click', function () {
      const website = websiteInput.value.trim();
      if (website) {
        chrome.storage.sync.get(['blockedSites'], function (result) {
          const blockedSites = result.blockedSites || [];

          if (!(blockedSites.includes(website))){
            blockedSites.push(website);
            chrome.storage.sync.set({ blockedSites }, function () {
              console.log(`${website} blocked.`);
              updateBlockedList(blockedSites);
            });
          } 
          else {
            console.log(`${website} is already blocked.`)
          }
        });
      }
    });
  });