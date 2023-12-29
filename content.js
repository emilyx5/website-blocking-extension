const container = document.createElement('div');
container.id = 'extension-container';

container.innerHTML = chrome.extension.getURL('content.html');

document.body.appendChild(container);
