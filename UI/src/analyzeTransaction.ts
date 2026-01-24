import type { TransactionInput, VerdictOutput } from "./types/transaction.ts"

import { analyzeHeuristics } from "./agents/heuristics.ts"
import { coordinatorRisk } from "./agents/coordinator.ts"
import { generateRiskExplanation } from "./ai/gemini.ts"

//Main Orchestration
//this is a way to connect all the layer so that p1 do not need to call them seperately
export async function analyzeTransaction(
    tx: TransactionInput
): Promise<VerdictOutput> {
    const signal = analyzeHeuristics(tx)

    const riskResult = coordinatorRisk(signal)

    const explanation = await generateRiskExplanation(riskResult)

    const decision = riskResult.level === "high" ? "block" : "allow"

    return {
        decision,
        risklevel: riskResult.level,
        score: riskResult.score,
        summary: explanation,
    }
}