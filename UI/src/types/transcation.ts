// The nervous system of SentinelWallet 
// Define how data flows between layers --> common language to communicate between layers

// TransactionInput -- is the minimum input SentinelWallet need to analyze transaction before signing.
// What am i about to sign ?
// to - value - data (contract call login) - chainId

export interface TransactionInput {
    to: string  //destination address
    value: string  //native token value (in wei as string)
    data?: string  //call data (optional)  {because simple eth tranfer donot have call data}
    chainId: number //chain identifer
}

// RiskFlag -- named reason why something feels risky
// a label, not a judgement

export const RiskFlag = {
    INFINITE_APPROVAL: "INFINITE_APPROVAL",
    NEW_CONTRACT: "NEW_CONTRACT",
    HIGH_VALUE_TX: "HIGH_VALUE_TX",
    FIRST_TIME_INTERACTION: "FIRST_TIME_INTERACTION"
} as const;

export type RiskFlag = typeof RiskFlag[keyof typeof RiskFlag];

// RiskSignal -- a flag + how bad is it + optional evidenec.
// Flag - severity - confidence --> later GEMINI can say likely vs confirmed

export type RiskSeverity = "low" | "medium" | "high"

export interface RiskSignal {
    flag: RiskFlag
    severity: RiskSeverity
    confidence: number  // 0 - 1
    details?: string  //optional evidence
}

// RiskResult -- The output of analysis and not result
// this is where all the signals are summarized
// score {numeric comparison} - level {SAFE / CAUTION / HIGH} - signals  {explainability}

export type RiskLevel = "safe" | "caution" | "high"

export interface RiskResult {
    score: number
    level: RiskLevel
    signals: RiskSignal[]
}

// VerdictOutput -- the final output
// decision - risklevel - summary - score

export type VerdictDecision = "allow" | "block"

export interface VerdictOutput {
    decision: VerdictDecision
    risklevel: RiskLevel
    score: number
    summary: string     //human readable explanation
}