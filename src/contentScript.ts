// const s = document.createElement("script");
// s.src = chrome.runtime.getURL("inject.js");
// (document.head || document.documentElement).appendChild(s);

// window.addEventListener("message", (e) => {
//   if (e.data?.type !== "P1_TX") return;

//   chrome.runtime.sendMessage(e.data.payload, (decision) => {
//     window.postMessage({ type: "P1_DECISION", decision }, "*");
//   });
// });

const s = document.createElement("script");
s.src = chrome.runtime.getURL("dist/inject.js"); 
s.type = "text/javascript";
(document.head || document.documentElement).appendChild(s);
s.onload = () => s.remove();

window.addEventListener("message", (e) => {
  if (e.source !== window) return;
  if (e.data?.type !== "P1_TX") return;

  chrome.runtime.sendMessage(
    e.data.payload,
    (response) => {
      window.postMessage(
        {
          type: "P1_DECISION",
          decision: response?.decision
        },
        "*"
      );
    }
  );
});
