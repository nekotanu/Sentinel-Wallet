import { RiskFlag } from "../types/transaction.ts"
import type { RiskResult } from "../types/transaction.ts"

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY //vite way of give access to .env variables
// vite only expose variables to browser code if they content VITE_ at the start

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
//google offical REST endpoint for gemini


//HELPER_FUNCTIONS

function flagToReason(flags: RiskFlag[]): string[] {
    return flags.map((flag) => {
        switch (flag) {
            case RiskFlag.INFINITE_APPROVAL:
                return "The transaction allow unlimited access to your tokens"
            case RiskFlag.FIRST_TIME_INTERACTION:
                return "This is the first time you are interacting with this address"
            case RiskFlag.HIGH_VALUE_TX:
                return "The amount being send is unusually high"
            case RiskFlag.NEW_CONTRACT:
                return "The transcation intreacts with newly created or unknown contract"
            default:
                return "The transaction shows unusual behavior";

        }

    })
}

function buildPrompt(result: RiskResult): string {
    const reasons = flagToReason(
        result.signals.map((s) => s.flag)
    ).map((r) => `- ${r}`).join("\n")
    // Seperating flags from RiskResults 
    //giving the proper structure

    return `
    you are a security assistant explaining blockchain transcations risk to a non-technincal user.

    Risk level: ${result.level.toUpperCase()}
    Score level: ${result.score} out of 100

    Detected Risk Indicators:
    ${reasons}

    RULES:
    - Explain the Risk in plain English.
    - Use a calm, neutral tone.
    - Maximum 3 sentences.
    - Do not use technical jargon.
    - Do not introduce new risk.
    - Do not give instructions or advice.
    `.trim()
    //this prompt prevents AI to hallucinat
}

//PUBLIC_API

export async function generateRiskExplanation(
    result: RiskResult
): Promise<string> {

    //if API is not working returns this fallback
    const fallback = "This transcation show multiple risk indicators. Please review it carefully before proceeding"

    if (!GEMINI_API_KEY) {
        return fallback
    }
    //POST request to gemini api
    try {
        const response = await fetch(
            `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: buildPrompt(result) }
                    ]
                }]


            }
            )
        }
        )

        if (!response.ok) {
            return fallback
        }

        const data = await response.json()
        //optional chaining to prevent runtime crash
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (typeof text !== "string") {
            return fallback
        }

        return text.trim()

    } catch {
        return fallback
    }


}