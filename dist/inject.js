"use strict";
console.log("🔥 Sentinel inject.js loaded");
const hook = () => {
    const eth = window.ethereum;
    if (!eth || !eth.request) {
        // MetaMask not injected yet → retry
        setTimeout(hook, 100);
        return;
    }
    // Prevent double-hooking
    if (eth.__sentinelHooked)
        return;
    eth.__sentinelHooked = true;
    const originalRequest = eth.request.bind(eth);
    eth.request = async (args) => {
        console.log("🧪 eth.request called:", args.method);
        if (args.method === "eth_sendTransaction" ||
            args.method === "eth_signTypedData") {
            const tx = args.params?.[0];
            console.log("🚨 TX INTERCEPTED", tx);
            window.postMessage({
                source: "SENTINEL",
                payload: {
                    method: args.method,
                    to: tx?.to,
                    value: tx?.value,
                    data: tx?.data,
                    chainId: tx?.chainId
                }
            }, "*");
            const decision = await new Promise((resolve) => {
                const handler = (e) => {
                    if (e.data?.source === "SENTINEL_DECISION") {
                        window.removeEventListener("message", handler);
                        resolve(e.data.decision);
                    }
                };
                window.addEventListener("message", handler);
            });
            if (decision === "block") {
                throw new Error("Transaction blocked by SentinelWallet");
            }
        }
        return originalRequest(args);
    };
    console.log("🪝 Sentinel ethereum.request hooked");
};
hook();
