import { analyzeHeuristics } from "../agents/heuristics";

const testTx = {
    to: "0x12323413489124",
    value: "2000000000000000000",
    data: "0x095ea7b3ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    chainId: 1
}

const result = analyzeHeuristics(testTx)

console.log("HeuristicsTesting: ", result)