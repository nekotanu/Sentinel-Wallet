// Given a transaction, what known-risk patterns are present?

import { RiskFlag } from "../types/transaction.ts";
import type { TransactionInput, RiskSignal } from "../types/transaction.ts";



// ERC20 -> standard token of etherium
//what is this ERC20_APPROVED_SELECTOR -> function identifer for ERC20 
// ECR20 approve(address spender, uint256 ammount)
// method id: 0x095ea7b3 --> first 4 bytes of function hash

const ERC20_APPROVE_SELECTOR = "0x095ea7b3"
const MAX_UINT256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"  //max value of uint256


//hardcoded abnormal value threshold (in wei 1 ETH)
// TO_BE_CHANGED!
const HIGH_VALUE_THRESHOLD = BigInt("1000000000000000000")  // BigInt supports arbitrarily large intergers which number can't handle




//INDIVIDUAL_HEURISTICS -> function to detect risk patterns

function checkInfiniteApproval(tx: TransactionInput): RiskSignal | null {

    if (!tx.data) return null // if tx does not have calldata return null 

    const data = tx.data.toLowerCase()

    if (!data.startsWith(ERC20_APPROVE_SELECTOR)) return null

    if (data.includes(MAX_UINT256.slice(2))) { // slice(2) removes 0x prefix -> calldata does not contains 0x -> we are searching inside raw hex data
        return {
            flag: RiskFlag.INFINITE_APPROVAL,
            severity: "high",
            confidence: 0.9,
            details: "Unlimited ERC20 token approval detected"
        }
    }

    return null
}


function checkAbnormalValues(tx: TransactionInput): RiskSignal | null {
    try {
        const value = BigInt(tx.value) // converting string to BigInt

        if (value >= HIGH_VALUE_THRESHOLD) {
            return {
                flag: RiskFlag.HIGH_VALUE_TX,
                severity: "medium",
                confidence: 0.7,
                details: "Transaction value significantly higher than typical",

            }
        }
    }
    catch {
        // ignore malformed value -> detection should never block execution
        //MAYBE_BUG! -> invalid tx like no value of somthing / edge case
    }
    return null
}


//PLACEHOLDER 
//T0_BE_CHANGED! : ENHANCE LATER WITH RPC : P3 or graph agent will improve this
// This checkNewContract is kind of a DUMMY! right now

function checkNewContract(tx: TransactionInput): RiskSignal | null {
    if (!tx.to) return null

    //MVP assumption : new contract = potential risk
    return {
        flag: RiskFlag.NEW_CONTRACT,
        severity: "medium",
        confidence: 0.6,
        details: "Interacting with a recently deployed or unknown contract"
    }

}



//MAIN_EXPORT_FUNCTION
// P3 will provide data to this function
// this is single public entry point for heuristics


export function analyzeHeuristics(tx: TransactionInput): RiskSignal[] {

    const signals: RiskSignal[] = []

    const approvalSignal = checkInfiniteApproval(tx)
    if (approvalSignal) signals.push(approvalSignal)

    const valueSignal = checkAbnormalValues(tx)
    if (valueSignal) signals.push(valueSignal)

    const contractSignal = checkNewContract(tx)
    if (contractSignal) signals.push(contractSignal)

    return signals
}



