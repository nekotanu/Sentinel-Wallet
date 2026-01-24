import { type RiskSignal, RiskFlag } from "../types/transaction.ts"

interface RiskModelProps {
    isOpen: boolean,
    risklevel: "safe" | "caution" | "high",
    score: number,
    signals: RiskSignal[],
    explanation: string,
    isLoading: boolean,
    onReject: () => null,
    onProceed: () => null,
}
//defines property that react componet will accept 


const LEVEL_STYLES = {
    safe: {
        title: "Looks Safe",
        color: "text-green-600",
        bg: "bg-green-50",
    },
    caution: {
        title: "Procced with Caution",
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    high: {
        title: "High Risk Detected",
        color: "text-red-600",
        bg: "bg-red-50"
    }
}

function flagToText(flag: RiskFlag): string {
    switch (flag) {
        case RiskFlag.INFINITE_APPROVAL:
            return "Unlimited token access requested";
        case RiskFlag.NEW_CONTRACT:
            return "Interacting with a newly created or unknown contract";
        case RiskFlag.HIGH_VALUE_TX:
            return "Unusually high transaction amount";
        case RiskFlag.FIRST_TIME_INTERACTION:
            return "First-time interaction with this address";
        default:
            return "Unusual transaction behavior detected";
    }
}

// later after learning (tailwind)
export function RiskModel({
    isOpen,
    risklevel,
    score,
    signals,
    explanation,
    isLoading,
    onReject,
    onProceed,

}: RiskModelProps) {
    if (!isOpen) return null

    const style = LEVEL_STYLES[risklevel];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className={`w-full max-w-md rounded-lg p-6 ${style.color}`}>
                <h2 className={`text-xl font-semibold ${style.color}`}>
                    {style.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Risk Score: {score}/100
                </p>

                <ul className="mt-4 space-y-2 text-sm text-grey-800">
                    {signals.map((signal, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span>•</span>
                            <span>{flagToText(signal.flag)}</span>

                        </li>
                    ))}
                </ul>

                <div className="mt-4 rounded-md bg-white p-3 text-sm text-grey-700">
                    {isLoading ? "Analyzing Transaction.." : explanation}
                </div>

                <div className="mt-6 flex justify-between gap-3">
                    <button onClick={onReject} className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                        Reject
                    </button>
                    <button onClick={onProceed} className="w-full rounded-md border border-grey-400 px-4 py-2 text-grey-800 hover:bg-grey-100">
                        Procced Anyway
                    </button>
                </div>

            </div>
        </div>

    )
}
