import { RiskFlag } from "../types/transaction.ts";
import type { RiskLevel, RiskResult, RiskSignal } from "../types/transaction.ts";

//SCORING_POLICY

//base weight per risk flag
const FLAG_WEIGHTS: Record<RiskFlag, number> = {
    [RiskFlag.INFINITE_APPROVAL]: 70,
    [RiskFlag.HIGH_VALUE_TX]: 30,
    [RiskFlag.NEW_CONTRACT]: 25,
    [RiskFlag.FIRST_TIME_INTERACTION]: 20,
}


// severity multipliers
const SEVERITY_MULTIPLIERS: Record<string, number> = {
    low: 0.5,
    medium: 0.75,
    high: 1.0,
}

// we are defining objects of key-value pair < K, V>

//HELPER_FUNCTIONS

function calculateSignalScore(signal: RiskSignal): number {
    const baseWeight = FLAG_WEIGHTS[signal.flag] ?? 0
    const severityMultiplier = SEVERITY_MULTIPLIERS[signal.severity] ?? 1

    const confidence = Math.min(Math.max(signal.confidence, 0), 1)
    //clamppiping signal.confidence btw  0 - 1

    return baseWeight * severityMultiplier * confidence

    //CalculateSignlaScore takes RiskSignal and LookUpTables { FLAG_WEIGHTS , SEVERITY_MULTIPLIERS} to assign values according to flags
}


function mapScoreToLevel(score: number): RiskLevel {
    if (score >= 61) return "high"
    if (score >= 31) return "caution"
    return "safe"
}

//Main coordinator

export function coordinatorRisk(signals: RiskSignal[]): RiskResult {
    let totalScore = 0

    for (const signal of signals) {
        totalScore += calculateSignalScore(signal)
    }

    totalScore = Math.min(Math.round(totalScore), 100)

    const level = mapScoreToLevel(totalScore)

    return {
        score: totalScore,
        level,
        signals
    }
}

//how is the whole calculation is being calculated