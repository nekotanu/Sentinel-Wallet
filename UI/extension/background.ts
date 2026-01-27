// chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
//   console.log("TX intercepted:", msg);
//   sendResponse({ allow: true });
// });

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    console.log("TX intercepted:", msg);
    sendResponse({ decision: "allow" });
});
